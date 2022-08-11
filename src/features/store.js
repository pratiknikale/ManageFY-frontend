import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import chatReducer from "./chat/chatSlice";
import messagesReducer from "./chat/messagesSlice";
import todoTaskReducer from "./todoTasks/tasksSlice";
import assignedTaskReducer from "./assignedTasks/assignedTaskSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    messages: messagesReducer,
    todoTask: todoTaskReducer,
    assignedTask: assignedTaskReducer,
  },
});

export default store;
