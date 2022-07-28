import axios from "axios";
import {local, live} from "../config/apiUrl";

const API = axios.create({baseURL: local});
// const API = axios.create({baseURL: live});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`;
    req.headers.role = `Bearer ${JSON.parse(localStorage.getItem("profile")).result.role}`;
  }

  return req;
});

export const getList = async () => {
  return await API.get("/api/get");
};

export const getEdit = async (id) => {
  return await API.get(`/api/getId/${id}`);
};

export const editItem = async (id, data) => {
  return await API.put("/api/edit", {id: id, data: data});
};

export const updateStatus = async (id, status, stask, subtaskIndex) => {
  //REVISIT ....can be better
  return await API.put("/api/updateStatus", {id: id, status: status, stask: stask, subtaskIndex: subtaskIndex});
};

export const insertItem = async (item) => {
  return await API.post("/api/insert", {item: item});
};

export const deleteItem = async (id) => {
  return await API.delete(`/api/delete/${id}`);
};

export const signup = async (data, navigate) => {
  try {
    const signUp = await API.post("/userAuth/signup", data);
    localStorage.setItem("profile", JSON.stringify({...signUp?.data}));
    // navigate("/mytasks");
    return signUp;
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const managerSignup = async (data) => {
  try {
    const managersignUp = await API.post("/userAuth/managersignup", data);
    return managersignUp;
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const signin = async (Data, navigate) => {
  try {
    const signIn = await API.post("/userAuth/signin", Data);
    localStorage.setItem("profile", JSON.stringify({...signIn?.data}));
    // navigate("/mytasks");
    return signIn;
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const getManagerList = async () => {
  try {
    const getMList = await API.get("/manageManager/get");
    return getMList;
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const getEmployeeList = async () => {
  try {
    const getEList = await API.get("/manageEmployee/get");
    return getEList;
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const getEditUser = async (id) => {
  return await API.get(`/UserEdit/getUser/${id}`);
};

export const EditUser = async (data) => {
  return await API.put("/UserEdit/editUser", {data: data});
};

export const DeleteUser = async (id) => {
  return await API.delete(`/UserEdit/deleteUser/${id}`);
};

export const SearchUser = async (value, role) => {
  return await API.post(`/UserEdit/searchUser?search=${value}`, {role: role});
};

export const searchAllUser = async (value) => {
  return await API.get(`/UserEdit/searchAllUser?search=${value}`);
};

export const GetChats = async () => {
  return await API.get("/Chat/");
};

export const GetCreateSingleChat = async (userId) => {
  return await API.post("/Chat/", {userId: userId});
};

export const CreateGroup = async (gName, gUsers) => {
  return await API.post("/Chat/group", {users: gUsers, name: gName});
};

export const RemoveGroupUser = async (chatID, userID) => {
  return await API.put("/Chat/groupremove", {chatId: chatID, userId: userID});
};

export const RenameGroup = async (chatID, chatName) => {
  return await API.put("/Chat/rename", {chatId: chatID, chatName: chatName});
};

export const AddGroupUser = async (chatId, userId) => {
  return await API.put("/Chat/groupadd", {chatId: chatId, userId: userId});
};

export const getAllUsers = async () => {
  return await API.get("/UserEdit/getAllUsers");
};

export const getMessages = async (chatId) => {
  return await API.get(`/Message/${chatId}`);
};

export const sendMessages = async (content, chatId) => {
  return await API.post("/Message", {content: content, chatId: chatId});
};
