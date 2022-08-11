import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getList} from "../../services/api";

const initialState = {
  allTasks: [],
  allTasksFetched: false,
};

export const fetchAsyncMyAllTasks = createAsyncThunk("todoTask/fetchAsyncMyAllTasks", async () => {
  const response = await getList();
  return response.data;
});

export const todoTaskSlice = createSlice({
  name: "todoTask",
  initialState,
  reducers: {
    setAllTasksFetched: (state) => {
      state.allTasksFetched = !state.allTasksFetched;
    },
    addNewCreatedTask: (state, {payload}) => {
      return {...state, allTasks: [payload, ...state.allTasks]};
    },
    updateEditedTask: (state, {payload}) => {
      const task = payload.result;
      const Index = payload.EtaskEditIndex;

      state.allTasks.splice(Index, 1);
      state.allTasks.splice(Index, 0, task);
    },
    setFullTaskStatus: (state, {payload}) => {
      state.allTasks.map((task, i) => {
        if (task._id === payload._id) {
          state.allTasks.splice(i, 1);
          state.allTasks.splice(i, 0, payload);
        }
      });
    },
  },
  extraReducers: {
    [fetchAsyncMyAllTasks.fulfilled]: (state, {payload}) => {
      console.log("all tasks fetch successfully");
      state.allTasks = payload;
    },
  },
});

export const {addNewCreatedTask, updateEditedTask, setAllTasksFetched, setFullTaskStatus} = todoTaskSlice.actions;

export default todoTaskSlice.reducer;
