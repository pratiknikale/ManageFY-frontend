import React, {useState, useContext} from "react";
import {Badge, Button, Col, FormControl, Modal, Row} from "react-bootstrap";
import {getSender} from "../config/chatLogics";
import {AddGroupUser, RenameGroup} from "../services/api";
import ClipLoader from "react-spinners/ClipLoader";
import {css} from "@emotion/react";
import {useSelector, useDispatch} from "react-redux";
import {delAGroupUser, setSelectedChat, resetSortAllChats} from "../features/chat/chatSlice";
import {onAllOrgUsersSearchChange} from "../handler/chatHandler";
import {SocketContext} from "../context/socket";
import "../styles/ChatProfileModal.css";

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
  margin-left: 6px;
`;

const ChatProfileModal = () => {
  const socket = useContext(SocketContext);

  const dispatch = useDispatch();

  // redux data
  const user = useSelector((state) => state.user.user);
  const myAllChats = useSelector((state) => state.chat.myAllChats);
  const allOrgUsers = useSelector((state) => state.user.allOrgUsers);
  const filteredAllOrgUsers = useSelector((state) => state.user.filteredAllOrgUsers);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  // redux data

  // useState Hooks
  const [chatOptionModalShow, setChatOptionModalShow] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [userDelAddLoading, setUserDelAddLoading] = useState(false);
  const [groupRenameLoading, setGroupRenameLoading] = useState(false);
  // useState Hooks

  const delAGroupUserHandler = async (chat, userID) => {
    setUserDelAddLoading(true);
    const popedSelectedChatArray = await myAllChats.filter((filChat) => {
      return chat._id !== filChat._id;
    });

    if (userID === user.result._id) {
      if (window.confirm("Are you sure you want to leave the group?") === true) {
        dispatch(
          delAGroupUser({
            chat: chat,
            userID: userID,
            popedSelectedChatArray: popedSelectedChatArray,
            selfDeleteFromGroup: true,
            loggedUserId: user.result._id,
            socket: socket,
          })
        );
      }
    } else {
      dispatch(
        delAGroupUser({
          chat: chat,
          userID: userID,
          popedSelectedChatArray: popedSelectedChatArray,
          selfDeleteFromGroup: false,
          loggedUserId: user.result._id,
          socket: socket,
        })
      );
    }
    setUserDelAddLoading(false);
  };

  const onRenameGroupChange = (e) => {
    e.preventDefault();

    setNewGroupName(e.target.value);
  };

  const renameGroupSubmit = async (chat, NewGName) => {
    setGroupRenameLoading(true);
    const popedSelectedChatArray = await myAllChats.filter((FilChat) => {
      return selectedChat._id !== FilChat._id;
    });
    const selectedGroupUserIds = await chat.users.map((users) => {
      return users._id;
    });
    const loggedUserRemovedUserIds = await selectedGroupUserIds.filter((ids) => {
      return ids !== user.result._id;
    });

    const response = await RenameGroup(chat._id, NewGName);

    socket.emit("group-edit", response.data, loggedUserRemovedUserIds);
    dispatch(resetSortAllChats({selectedChat: response.data, popedSelectedChatArray: popedSelectedChatArray}));
    dispatch(setSelectedChat(response.data));
    setGroupRenameLoading(false);
  };

  const addUserToGroup = async (chat, userID) => {
    setUserDelAddLoading(true);
    const popedSelectedChatArray = await myAllChats.filter((FilChat) => {
      return selectedChat._id !== FilChat._id;
    });
    const selectedGroupUserIds = await chat.users.map((users) => {
      return users._id;
    });
    const loggedUserRemovedUserIds = await selectedGroupUserIds.filter((ids) => {
      return ids !== user.result._id;
    });

    if (selectedChat.users.find((u) => u._id === userID)) {
      alert("user already exists");
    } else {
      const {data} = await AddGroupUser(chat._id, userID);

      socket.emit("group-edit", data, loggedUserRemovedUserIds);

      dispatch(resetSortAllChats({selectedChat: data, popedSelectedChatArray: popedSelectedChatArray}));
      dispatch(setSelectedChat(data));
      // setUserDelLoading(false);
    }
    setUserDelAddLoading(false);
  };

  return (
    <>
      <Button
        variant="dark"
        style={{float: "right", borderRadius: "100px"}}
        onClick={() => setChatOptionModalShow(true)}
      >
        <i className="fas fa-ellipsis-v"></i>
      </Button>

      <Modal
        show={chatOptionModalShow}
        onHide={() => setChatOptionModalShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          style={{display: "block", backgroundColor: "#343a40", color: "white", borderBottom: "1px solid black"}}
        >
          {selectedChat._id && selectedChat.isGroupChat ? (
            <>
              <h5 style={{marginBottom: "15px", textAlign: "center"}}>
                {selectedChat.chatName}
                {groupRenameLoading && (
                  <ClipLoader
                    loading={groupRenameLoading}
                    speedMultiplier={2}
                    color={"blue"}
                    css={btnoverride}
                    size={17}
                  />
                )}
              </h5>
            </>
          ) : (
            <h5 style={{marginBottom: "15px", textAlign: "center"}}>{getSender(user.result, selectedChat.users)}</h5>
          )}

          {selectedChat.isGroupChat &&
            selectedChat.users.map((selectedUsers) => (
              <Badge key={selectedUsers._id} pill className="mx-1" style={{backgroundColor: "black", color: "#b7b7b7"}}>
                {selectedUsers.firstName}
                <span onClick={() => delAGroupUserHandler(selectedChat, selectedUsers._id)} style={{cursor: "pointer"}}>
                  &nbsp;&nbsp;
                  <b>X</b>
                </span>
              </Badge>
            ))}
          {userDelAddLoading && (
            <ClipLoader loading={userDelAddLoading} speedMultiplier={2} color={"blue"} css={btnoverride} size={17} />
          )}
        </Modal.Header>
        <Modal.Body style={{backgroundColor: "#343a40", color: "white"}}>
          {selectedChat.isGroupChat && (
            <>
              <div style={{display: "flex", alignItems: "center"}}>
                <FormControl
                  onChange={(e) => onRenameGroupChange(e)}
                  type="text"
                  placeholder="Rename Group"
                  style={{
                    width: "100%",
                    borderRadius: "20px",
                    color: "#b9b9b9",
                    backgroundColor: "#212529",
                    borderColor: "transparent",
                  }}
                  className="my-3 mr-2"
                />
                <Button
                  style={{width: "130px", borderRadius: "100px", backgroundColor: "black", borderColor: "transparent"}}
                  onClick={() => renameGroupSubmit(selectedChat, newGroupName)}
                >
                  Update
                </Button>
              </div>
              <div style={{display: "flex", alignItems: "center"}}>
                <FormControl
                  onChange={(e) => onAllOrgUsersSearchChange(e, user.result._id, allOrgUsers, dispatch)}
                  type="text"
                  placeholder="Search New User to add"
                  style={{
                    width: "100%",
                    borderRadius: "20px",
                    color: "#b9b9b9",
                    backgroundColor: "#212529",
                    borderColor: "transparent",
                  }}
                  className="my-3 mr-2"
                />
              </div>
              <Modal.Body style={{maxHeight: "170px", overflowX: "auto"}}>
                {filteredAllOrgUsers &&
                  filteredAllOrgUsers.map((users, i) => (
                    <Button
                      key={users._id}
                      onClick={() => addUserToGroup(selectedChat, users._id)}
                      className="my-1"
                      variant="light"
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        backgroundColor: "#495057",
                        color: "#b7b7b7",
                        borderColor: "transparent",
                      }}
                    >
                      <Row>
                        <Col sm={1} style={{display: "flex", alignItems: "center"}}>
                          <i className="far fa-user fa-2x mr-3"></i>
                        </Col>
                        <Col sm={11} style={{paddingTop: "14px", paddingLeft: "24px"}}>
                          {users.firstName} {users.lastName}
                          <p style={{fontSize: "14px"}}>
                            <b>Email</b>: {users.email}
                          </p>
                        </Col>
                      </Row>
                    </Button>
                  ))}
              </Modal.Body>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{backgroundColor: "#343a40", color: "white", borderTop: "1px solid black"}}>
          {selectedChat.isGroupChat && (
            <Button
              onClick={() => delAGroupUserHandler(selectedChat, user.result._id)}
              style={{borderRadius: "100px", backgroundColor: "black", borderColor: "transparent", color: "red"}}
            >
              <b>Leave Group</b>
            </Button>
          )}
          <Button
            onClick={() => setChatOptionModalShow(false)}
            style={{borderRadius: "100px", backgroundColor: "black", borderColor: "transparent"}}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChatProfileModal;
