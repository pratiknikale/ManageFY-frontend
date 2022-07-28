import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import chatReducer from "./chat/chatSlice";
import messagesReducer from "./chat/messagesSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    messages: messagesReducer,
  },
});

export default store;
