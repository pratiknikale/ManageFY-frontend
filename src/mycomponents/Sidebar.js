import React, {useContext, useEffect, useRef} from "react";
import {NavLink} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import "../styles/Sidebar.css";
import {SocketContext} from "../context/socket";
import {receivedNewMsg} from "../features/chat/messagesSlice";
import {resetSortAllChats, setSelectedChat, receiveAddNewChat} from "../features/chat/chatSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);

  const role = useSelector((state) => state.user.role);
  const user = useSelector((state) => state.user.user);
  const filteredChats = useSelector((state) => state.chat.filteredChats);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const allChatsFetched = useSelector((state) => state.chat.allChatsFetched);

  const SelectedChatRef = React.useRef(selectedChat);
  const FilteredChatsRef = React.useRef(filteredChats);
  React.useEffect(() => {
    SelectedChatRef.current = selectedChat;
    FilteredChatsRef.current = filteredChats;
  });

  const messageReceiveHandler = async (message, chat, selectedChat, filteredChats) => {
    if (selectedChat._id && selectedChat._id === chat._id) {
      let popedSelectedChatArray = await filteredChats.filter((filChat) => {
        return selectedChat._id !== filChat._id;
      });
      dispatch(setSelectedChat(chat));
      if (filteredChats[0]._id !== chat._id) {
        dispatch(resetSortAllChats({selectedChat: chat, popedSelectedChatArray: popedSelectedChatArray}));
      }
      dispatch(receivedNewMsg(message));
    } else {
      if (allChatsFetched) {
        console.log("into /Chats");
        let popedSelectedChatArray = await filteredChats.filter((filChat) => {
          return chat._id !== filChat._id;
        });

        if (filteredChats.length > 0) {
          if (filteredChats[0]._id !== chat._id) {
            dispatch(resetSortAllChats({selectedChat: chat, popedSelectedChatArray: popedSelectedChatArray}));
          }
        } else {
          dispatch(resetSortAllChats({selectedChat: chat, popedSelectedChatArray: popedSelectedChatArray}));
        }
      }
    }
  };

  const newGroupEditedHandler = async (chat, filteredChats) => {
    let popedSelectedChatArray = await filteredChats.filter((FilChat) => {
      return chat._id !== FilChat._id;
    });

    dispatch(resetSortAllChats({selectedChat: chat, popedSelectedChatArray: popedSelectedChatArray}));
  };

  useEffect(() => {
    user && socket && socket.emit("setup", user.result._id);

    const newMsghandler = (message, chat) => {
      messageReceiveHandler(message, chat, SelectedChatRef.current, FilteredChatsRef.current);
    };
    const grpEditHandler = (chat) => {
      newGroupEditedHandler(chat, FilteredChatsRef.current);
    };

    socket.on("Receive-Message", newMsghandler);

    socket.on("Single-Chat-Created", (chat) => {
      dispatch(receiveAddNewChat(chat));
    });

    socket.on("new-group-chat", (chat) => {
      dispatch(receiveAddNewChat(chat));
    });

    socket.on("new-group-edited", grpEditHandler);
  }, [user, socket]);

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
          <NavLink to="/Chats" className="side-menuItems">
            <i style={{width: "33px"}} className="fas fa-comments"></i>Chats
            {/* <i style={{width: "33px"}} className="fas fa-tasks"></i>Chats */}
          </NavLink>
        </li>

        <li className="side-menuLI" style={{marginTop: "auto"}}>
          <NavLink to="/Settings" className="side-menuItems">
            <i style={{width: "33px"}} className="fa-solid fa-gear"></i>Settings
          </NavLink>
        </li>
      </ul>
      {/* </div> */}
    </div>
  );
};

export default Sidebar;
