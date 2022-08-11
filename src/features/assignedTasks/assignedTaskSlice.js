import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getmanagersAssignedTsk} from "../../services/api";
// import {} from "../../services/api";

const initialState = {
  allAssignedTasks: [],
  allAssignedTasksFetched: false,
};

export const fetchallAssignedTasks = createAsyncThunk("assignedTask/fetchallAssignedTasks", async ({managerId}) => {
  const response = await getmanagersAssignedTsk(managerId);
  return response.data;
});

export const assignedTaskSlice = createSlice({
  name: "assignedTask",
  initialState,
  reducers: {
    setAllAssignedTasksFetched: (state) => {
      state.allAssignedTasksFetched = !state.allAssignedTasksFetched;
    },
    addNewAssignedTask: (state, {payload}) => {
      return {...state, allAssignedTasks: [payload, ...state.allAssignedTasks]};
    },
    updateEditedAssignTask: (state, {payload}) => {
      // console.log(payload);
      const task = payload.result;
      const Index = payload.EtaskEditIndex;

      state.allAssignedTasks.splice(Index, 1);
      state.allAssignedTasks.splice(Index, 0, task);
    },
  },
  extraReducers: {
    [fetchallAssignedTasks.fulfilled]: (state, {payload}) => {
      console.log("all assigned tasks fetch successfully");
      state.allAssignedTasks = payload;
      state.allAssignedTasksFetched = true;
    },
  },
});

export const {setAllAssignedTasksFetched, addNewAssignedTask, updateEditedAssignTask} = assignedTaskSlice.actions;

export default assignedTaskSlice.reducer;
