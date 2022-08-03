import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {GetChats, GetCreateSingleChat, CreateGroup, RemoveGroupUser} from "../../services/api";

const initialState = {
  myAllChats: [],
  allChatsFetched: false,
  filteredChats: [],
  selectedChat: {},
  singleUserChatCreateModel: false,
  groupChatCreateModel: false,
};

export const fetchAsyncMyAllChats = createAsyncThunk("chat/fetchAsyncMyAllChats", async () => {
  const response = await GetChats();
  return response.data;
});

export const GetAsyncCreateSingleChat = createAsyncThunk("chat/GetAsyncCreateSingleChat", async ({userId, socket}) => {
  const userChatToCreate = userId.toString();
  const response = await GetCreateSingleChat(userId);
  socket.emit("create-new-Single-chat", response.data, userChatToCreate);
  return response.data;
});
export const newGroupChatSubmit = createAsyncThunk(
  "chat/newGroupChatSubmit",
  async ({groupName, selectedGroupUsers, socket}) => {
    const selectedGroupUserIds = await selectedGroupUsers.map((users) => {
      return users._id;
    });
    const response = await CreateGroup(groupName, selectedGroupUsers);
    socket.emit("create-group", response.data, selectedGroupUserIds);
    return response.data;
  }
);

export const delAGroupUser = createAsyncThunk(
  "chat/delAGroupUser",
  async ({chat, userID, popedSelectedChatArray, selfDeleteFromGroup, loggedUserId, socket}) => {
    const selectedGroupUserIds = await chat.users.map((users) => {
      return users._id;
    });
    const loggedUserRemovedUserIds = await selectedGroupUserIds.filter((ids) => {
      return ids !== loggedUserId;
    });
    const response = await RemoveGroupUser(chat._id, userID);
    socket.emit("group-edit", response.data, loggedUserRemovedUserIds);

    return {
      chat: response.data,
      popedSelectedChatArray: popedSelectedChatArray,
      selfDeleteFromGroup: selfDeleteFromGroup,
    };
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, {payload}) => {
      state.selectedChat = payload;
    },
    myAllChatsSearchFilter: (state, {payload}) => {
      state.filteredChats = payload;
    },
    resetSortAllChats: (state, {payload}) => {
      let selectedChat = payload.selectedChat;
      let popedSelectedChatArray = payload.popedSelectedChatArray;

      state.myAllChats = [selectedChat, ...popedSelectedChatArray];
      state.filteredChats = [selectedChat, ...popedSelectedChatArray];
    },
    setSingleUserChatCreateModel: (state) => {
      state.singleUserChatCreateModel = !state.singleUserChatCreateModel;
    },
    setGroupChatCreateModel: (state) => {
      state.groupChatCreateModel = !state.groupChatCreateModel;
    },
    receiveAddNewChat: (state, {payload}) => {
      if (payload.isGroupChat) {
        if (!state.myAllChats.includes(payload) && !state.filteredChats.includes(payload)) {
          state.myAllChats = [payload, ...state.myAllChats];
          state.filteredChats = [payload, ...state.filteredChats];
        }
      } else {
        if (!state.myAllChats.includes(payload.chat) && !state.filteredChats.includes(payload.chat)) {
          state.myAllChats = [payload.chat, ...state.myAllChats];
          state.filteredChats = [payload.chat, ...state.filteredChats];
        }
      }
    },
    setAllChatsFetched: (state) => {
      state.allChatsFetched = !state.allChatsFetched;
    },
  },
  extraReducers: {
    [fetchAsyncMyAllChats.fulfilled]: (state, {payload}) => {
      // console.log("my chats fetch successfully");
      return {...state, myAllChats: payload, filteredChats: payload, myAllChatsLoading: false};
    },
    [GetAsyncCreateSingleChat.fulfilled]: (state, {payload}) => {
      // console.log("get create single successfully");

      state.selectedChat = payload.chat;

      if (!payload.AlteadyExsists) {
        // console.log("AlteadyExsists");
        state.myAllChats = [payload.chat, ...state.myAllChats];
        state.filteredChats = [payload.chat, ...state.filteredChats];
      }
    },
    [newGroupChatSubmit.fulfilled]: (state, {payload}) => {
      // console.log("get create group chat successfully");

      state.selectedChat = payload;
      state.myAllChats = [payload, ...state.myAllChats];
      state.filteredChats = [payload, ...state.filteredChats];
    },
    [delAGroupUser.fulfilled]: (state, {payload}) => {
      // console.log("gemoved a group user successfully");
      if (payload.selfDeleteFromGroup) {
        state.myAllChats = payload.popedSelectedChatArray;
        state.filteredChats = payload.popedSelectedChatArray;
        state.selectedChat = {};
      } else {
        state.myAllChats = [payload.chat, ...payload.popedSelectedChatArray];
        state.filteredChats = [payload.chat, ...payload.popedSelectedChatArray];
        state.selectedChat = payload.chat;
      }
    },
  },
});

export const {
  setSelectedChat,
  myAllChatsSearchFilter,
  resetSortAllChats,
  setSingleUserChatCreateModel,
  setGroupChatCreateModel,
  receiveAddNewChat,
  setAllChatsFetched,
} = chatSlice.actions;

export default chatSlice.reducer;
