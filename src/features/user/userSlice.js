import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getAllUsers} from "../../services/api";
// import api from "../../common/api/api";
// import apiKey from "../../common/api/omdbApiKey";

const initialState = {
  user: {},
  role: "",
  allOrgUsers: [],
  filteredAllOrgUsers: [],
};

export const fetchallOrgUsers = createAsyncThunk("user/fetchallOrgUsers", async (loggedUserId) => {
  const response = await getAllUsers();

  const RemovedLoggedUser = response.data.filter((user) => {
    return loggedUserId !== user._id;
  });

  return RemovedLoggedUser;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedUser: (state, {payload}) => {
      state.user = payload;
    },
    setLoggedUserRole: (state, {payload}) => {
      state.role = payload;
    },
    setfilteredAllOrgUsers: (state, {payload}) => {
      state.filteredAllOrgUsers = payload;
    },
  },
  extraReducers: {
    [fetchallOrgUsers.fulfilled]: (state, {payload}) => {
      return {...state, allOrgUsers: payload, filteredAllOrgUsers: payload};
    },
  },
});

export const {setLoggedUser, setLoggedUserRole, setfilteredAllOrgUsers} = userSlice.actions;

export default userSlice.reducer;
