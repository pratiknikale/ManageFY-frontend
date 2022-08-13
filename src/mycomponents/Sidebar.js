import React, {useContext, useEffect, useRef} from "react";
import {NavLink} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import "../styles/Sidebar.css";
import {SocketContext} from "../context/socket";
import {receivedNewMsg} from "../features/chat/messagesSlice";
import {
  fetchAsyncMyAllChats,
  setAllChatsFetched,
  resetSortAllChats,
  setSelectedChat,
  receiveAddNewChat,
  newChatNotification,
  setNotificationChatIds,
} from "../features/chat/chatSlice";
import {fetchallOrgUsers} from "../features/user/userSlice";
import {setChatMessageRead} from "../services/api";
import {Badge} from "react-bootstrap";

const Sidebar = () => {
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);

  const role = useSelector((state) => state.user.role);
  const user = useSelector((state) => state.user.user);
  const filteredChats = useSelector((state) => state.chat.filteredChats);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const allChatsFetched = useSelector((state) => state.chat.allChatsFetched);
  const notificationChatIds = useSelector((state) => state.chat.notificationChatIds);

  const SelectedChatRef = useRef(selectedChat);
  const FilteredChatsRef = useRef(filteredChats);
  const allChatsFetchedRef = useRef(allChatsFetched);
  React.useEffect(() => {
    SelectedChatRef.current = selectedChat;
    FilteredChatsRef.current = filteredChats;
    allChatsFetchedRef.current = allChatsFetched;
  });

  const messageReceiveHandler = async (message, chat, selectedChat, filteredChats, allChatsFetched) => {
    if (selectedChat._id && selectedChat._id === chat._id) {
      let updatedChat = await setChatMessageRead(chat._id, user.result._id, true);

      let popedSelectedChatArray = await filteredChats.filter((filChat) => {
        return selectedChat._id !== filChat._id;
      });
      dispatch(setSelectedChat(updatedChat.data));
      if (filteredChats[0]._id !== chat._id) {
        dispatch(resetSortAllChats({selectedChat: updatedChat.data, popedSelectedChatArray: popedSelectedChatArray}));
      }
      dispatch(receivedNewMsg(message));
    } else {
      if (allChatsFetched) {
        dispatch(newChatNotification(chat._id));
        let popedSelectedChatArray = await filteredChats.filter((filChat) => {
          return chat._id !== filChat._id;
        });
        dispatch(resetSortAllChats({selectedChat: chat, popedSelectedChatArray: popedSelectedChatArray}));
        newMessageWindowNotification(message);
      }
    }
  };

  const newGroupEditedHandler = async (chat, filteredChats) => {
    let popedSelectedChatArray = await filteredChats.filter((FilChat) => {
      return chat._id !== FilChat._id;
    });

    dispatch(resetSortAllChats({selectedChat: chat, popedSelectedChatArray: popedSelectedChatArray}));
    dispatch(newChatNotification(chat._id));
  };

  // chat related socket implimentation
  useEffect(() => {
    socket && socket.emit("setup", user.result._id);

    const newMsghandler = (message, chat) => {
      messageReceiveHandler(
        message,
        chat,
        SelectedChatRef.current,
        FilteredChatsRef.current,
        allChatsFetchedRef.current
      );
    };
    const grpEditHandler = (chat) => {
      newGroupEditedHandler(chat, FilteredChatsRef.current);
    };

    socket.on("Receive-Message", newMsghandler);

    socket.on("Single-Chat-Created", (chat) => {
      dispatch(receiveAddNewChat(chat));
      dispatch(newChatNotification(chat._id));
    });

    socket.on("new-group-chat", (chat) => {
      dispatch(receiveAddNewChat(chat));
      dispatch(newChatNotification(chat._id));
    });

    socket.on("new-group-edited", grpEditHandler);
  }, []);

  // fetching all my chats, setting chat notifications and saving in redux state
  useEffect(() => {
    if (!allChatsFetched && user.result) {
      // setMyAllChatsLoading(true);
      dispatch(fetchAsyncMyAllChats()).then((allChats) => {
        let notificationChats = allChats.payload.filter((filChat) => {
          if (filChat.notificationUsers.length > 0) {
            let loggedUserFound = filChat.notificationUsers.filter((filNotfyUser) => {
              return filNotfyUser._id == user.result._id;
            });
            return loggedUserFound.length > 0 ? true : false;
          }
          return false;
        });

        let notificationChatIds = notificationChats.map((mapChat) => {
          return mapChat._id;
        });

        dispatch(setNotificationChatIds(notificationChatIds));
        // setMyAllChatsLoading(false);
        dispatch(setAllChatsFetched());
      });
    }

    return () => dispatch(setSelectedChat({})); // cleanup function
  }, [dispatch, user]);

  // fetching all org user and saving in redux state
  useEffect(() => {
    user.result && dispatch(fetchallOrgUsers(user.result._id));
  }, [user]);

  useEffect(() => {
    notifyMe();
  }, []);

  const newMessageWindowNotification = (message) => {
    const options = {
      body: message.content,
      renotify: false,
      silent: true,
    };
    new Notification(`New Message from ${message.sender.firstName} : `, options); //window puch notification
  };

  const notifyMe = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  return (
    <div className="Sidebar">
      {/* <div className="side-menu"> */}
      <ul style={{height: "100%", display: "flex", flexDirection: "column"}}>
        <li className="side-menuLI">
          <NavLink to="/mytasks" className="side-menuItems">
            <i style={{width: "33px"}} className="fas fa-tasks"></i>My Tasks
          </NavLink>
        </li>

        {role === "manager" && (
          <>
            <li className="side-menuLI">
              <NavLink to="/Assigned" className="side-menuItems">
                <i style={{width: "33px"}} className="far fa-calendar-plus"></i>Assigned Tasks
              </NavLink>
            </li>
            <li className="side-menuLI">
              <NavLink to="/ManageEmployee" className="side-menuItems">
                <i style={{width: "33px"}} className="fas fa-users"></i>Manage Employees
              </NavLink>
            </li>
            <li className="side-menuLI">
              <NavLink to="/ManageManager" className="side-menuItems">
                <i style={{width: "33px"}} className="fas fa-user-tie"></i>Manage Managers
              </NavLink>
            </li>
          </>
        )}
        <li className="side-menuLI">
          {notificationChatIds && notificationChatIds.length > 0 && <Badge className="newChatMessageBadge">1</Badge>}
          <NavLink to="/Chats" className="side-menuItems">
            <i style={{width: "33px"}} className="fas fa-comments"></i>Chats
          </NavLink>
        </li>

        {/* <li className="side-menuLI" style={{marginTop: "auto"}}>
          <NavLink to="/Settings" className="side-menuItems">
            <i style={{width: "33px"}} className="fa-solid fa-gear"></i>Settings
          </NavLink>
        </li> */}
      </ul>
      {/* </div> */}
    </div>
  );
};

export default Sidebar;
