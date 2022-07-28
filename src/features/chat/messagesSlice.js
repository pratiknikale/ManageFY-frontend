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
  async ({content, chatId}) => {
    const response = await sendMessages(content, chatId);
    return response.data;
  }
);

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchAsyncSelectedChatMessages.pending]: (state) => {
      console.log("messages for selected chat pending");
      return {...state, messagesLoader: true};
    },
    [fetchAsyncSelectedChatMessages.fulfilled]: (state, {payload}) => {
      console.log("messages for selected chat fetch successfully");
      return {...state, messages: payload, messagesLoader: false};
    },
    [fetchAsyncSelectedChatMessages.rejected]: (state) => {
      console.log("messages for selected chat rejected!!");
      return {...state, messagesLoader: false};
    },
    [SendAsyncSelectedChatMessage.pending]: (state) => {
      console.log("send message pending");
      return {...state, sentMessagesLoader: true};
    },
    [SendAsyncSelectedChatMessage.fulfilled]: (state, {payload}) => {
      console.log("send message fetch successfully");
      return {...state, messages: [...state.messages, payload], sentMessagesLoader: false};
    },
    [SendAsyncSelectedChatMessage.rejected]: (state) => {
      console.log("send message rejected!!");
      return {...state, sentMessagesLoader: false};
    },
  },
});

// export const {} = messagesSlice.actions;

export default messagesSlice.reducer;
