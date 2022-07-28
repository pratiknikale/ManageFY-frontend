import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {GetChats, GetCreateSingleChat, CreateGroup} from "../../services/api";

const initialState = {
  myAllChats: [],
  filteredChats: [],
  myAllChatsLoading: false,
  selectedChat: {},
  singleUserChatCreateModel: false,
  groupChatCreateModel: false,
};

export const fetchAsyncMyAllChats = createAsyncThunk("chat/fetchAsyncMyAllChats", async () => {
  const response = await GetChats();
  return response.data;
});

export const GetAsyncCreateSingleChat = createAsyncThunk("chat/GetAsyncCreateSingleChat", async (userId) => {
  const response = await GetCreateSingleChat(userId);
  return response.data;
});
export const newGroupChatSubmit = createAsyncThunk(
  "chat/newGroupChatSubmit",
  async ({groupName, selectedGroupUsers}) => {
    const response = await CreateGroup(groupName, selectedGroupUsers);

    return response.data;
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
  },
  extraReducers: {
    [fetchAsyncMyAllChats.pending]: (state) => {
      console.log("my chats pending");
      return {...state, myAllChatsLoading: true};
    },
    [fetchAsyncMyAllChats.fulfilled]: (state, {payload}) => {
      console.log("my chats fetch successfully");
      return {...state, myAllChats: payload, filteredChats: payload, myAllChatsLoading: false};
    },
    [fetchAsyncMyAllChats.rejected]: (state) => {
      console.log("my chats rejected!!");
      return {...state, myAllChatsLoading: false};
    },
    [GetAsyncCreateSingleChat.pending]: () => {
      console.log("get create single pending");
    },
    [GetAsyncCreateSingleChat.fulfilled]: (state, {payload}) => {
      console.log("get create single successfully");

      state.selectedChat = payload.chat;

      if (!payload.AlteadyExsists) {
        console.log("AlteadyExsists");
        state.myAllChats = [payload.chat, ...state.myAllChats];
        state.filteredChats = [payload.chat, ...state.filteredChats];
      }
    },
    [GetAsyncCreateSingleChat.rejected]: () => {
      console.log("get create single chat rejected!!");
    },
    [newGroupChatSubmit.pending]: () => {
      console.log("get create group chat pending");
    },
    [newGroupChatSubmit.fulfilled]: (state, {payload}) => {
      console.log("get create group chat successfully");

      state.selectedChat = payload;
      state.myAllChats = [payload, ...state.myAllChats];
      state.filteredChats = [payload, ...state.filteredChats];
    },
    [newGroupChatSubmit.rejected]: () => {
      console.log("get create group chat rejected!!");
    },
  },
});

export const {
  setSelectedChat,
  myAllChatsSearchFilter,
  resetSortAllChats,
  setSingleUserChatCreateModel,
  setGroupChatCreateModel,
} = chatSlice.actions;

export default chatSlice.reducer;
