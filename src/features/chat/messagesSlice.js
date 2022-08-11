import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getMessages, sendMessages} from "../../services/api";

const initialState = {
  messages: [],
  messagesLoader: false,
  sentMessagesLoader: false,
};

// fetching all messages to select chat
export const fetchAsyncSelectedChatMessages = createAsyncThunk(
  "messages/fetchAsyncSelectedChatMessages",
  async (chatId) => {
    const response = await getMessages(chatId);
    return response.data;
  }
);

// sending message
export const SendAsyncSelectedChatMessage = createAsyncThunk(
  "messages/SendAsyncSelectedChatMessage",
  async ({content, chat, socket, userOtherThanLoggedIDs}) => {
    const response = await sendMessages(content, chat._id, userOtherThanLoggedIDs);
    socket.emit("Send-Message", response.data.message, userOtherThanLoggedIDs, response.data.updatedChatResults);
    return response.data.message;
  }
);

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    receivedNewMsg: (state, {payload}) => {
      if (state.messages.length === 0) {
        return {...state, messages: [...state.messages, payload]};
      }
      if (state.messages[state.messages.length - 1]._id !== payload._id) {
        return {...state, messages: [...state.messages, payload]};
      }
    },
  },
  extraReducers: {
    [fetchAsyncSelectedChatMessages.pending]: (state) => {
      // console.log("messages for selected chat pending");
      return {...state, messagesLoader: true};
    },
    [fetchAsyncSelectedChatMessages.fulfilled]: (state, {payload}) => {
      // console.log("messages for selected chat fetch successfully");
      return {...state, messages: payload, messagesLoader: false};
    },
    [fetchAsyncSelectedChatMessages.rejected]: (state) => {
      // console.log("messages for selected chat rejected!!");
      return {...state, messagesLoader: false};
    },
    [SendAsyncSelectedChatMessage.pending]: (state) => {
      return {...state, sentMessagesLoader: true};
    },
    [SendAsyncSelectedChatMessage.fulfilled]: (state, {payload}) => {
      // console.log("send message fetch successfully");

      return {...state, messages: [...state.messages, payload], sentMessagesLoader: false};
    },
    [SendAsyncSelectedChatMessage.rejected]: (state) => {
      return {...state, sentMessagesLoader: false};
    },
  },
});

export const {receivedNewMsg} = messagesSlice.actions;

export default messagesSlice.reducer;
