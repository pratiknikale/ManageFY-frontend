import React, {useState, useEffect, useContext} from "react";
import {Button, Container, Form, FormControl, Row, Col, OverlayTrigger, Tooltip, Modal, Badge} from "react-bootstrap";
import "../styles/Chat.css";
import {getSender} from "../config/chatLogics";
import ChatProfileModal from "../mycomponents/ChatProfileModal";
import MessagesBox from "../mycomponents/MessagesBox";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import {css} from "@emotion/react";
import {useSelector, useDispatch} from "react-redux";
import {fetchallOrgUsers, setfilteredAllOrgUsers} from "../features/user/userSlice";
import {
  fetchAsyncMyAllChats,
  setSelectedChat,
  setSingleUserChatCreateModel,
  setGroupChatCreateModel,
  GetAsyncCreateSingleChat,
  newGroupChatSubmit,
} from "../features/chat/chatSlice";
import {
  myAllChatsSearchHandler,
  handleSendMessage,
  messageToSendTypingHandler,
  onAllOrgUsersSearchChange,
} from "../handler/chatHandler";
import {BsEmojiSmileFill} from "react-icons/bs";
import Picker from "emoji-picker-react";
import {SocketContext} from "../context/socket";

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
  margin-left: 6px;
`;

const Chats = () => {
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);

  // data
  const user = useSelector((state) => state.user.user);
  const allOrgUsers = useSelector((state) => state.user.allOrgUsers);
  const filteredAllOrgUsers = useSelector((state) => state.user.filteredAllOrgUsers);
  const myAllChats = useSelector((state) => state.chat.myAllChats);
  const filteredChats = useSelector((state) => state.chat.filteredChats);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const singleChatModel = useSelector((state) => state.chat.singleUserChatCreateModel);
  const groupChatModel = useSelector((state) => state.chat.groupChatCreateModel);
  // data

  // loaders
  const [myAllChatsLoading, setMyAllChatsLoading] = useState(false);
  // loaders
  // useState Hooks
  const [messageToSend, setMessageToSend] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  // useState Hooks

  useEffect(() => {
    if (myAllChats.length < 1) {
      setMyAllChatsLoading(true);
      dispatch(fetchAsyncMyAllChats()).then(() => {
        setMyAllChatsLoading(false);
      });
    }

    return () => dispatch(setSelectedChat({})); // cleanup function
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({top: 0, left: 0});
  }, []);

  useEffect(() => {
    user.result && dispatch(fetchallOrgUsers(user.result._id));
  }, [user]);

  const emojiHideShowHandler = () => {
    setShowEmoji(!showEmoji);
  };

  const handleEmojiClick = (event, emoji) => {
    let message = messageToSend;

    message += emoji.emoji;
    setMessageToSend(message);
  };

  const onGroupNameChange = (e) => {
    e.preventDefault();
    setGroupName(e.target.value);
  };

  const deleteSelectUser = (selectedUser) => {
    const deletedUsersArray = selectedGroupUsers.filter((user) => {
      return user._id !== selectedUser._id;
    });

    setSelectedGroupUsers(deletedUsersArray);
  };

  return (
    <>
      <h4 style={{marginTop: "25px", marginBottom: "25px", marginLeft: "25px", color: "white"}}>Chats</h4>

      <Container fluid style={{marginBottom: "50px", maxWidth: "94%", flex: "1 0 auto"}}>
        <Row className="mx-5" style={{height: "50px"}}>
          <Col
            xs={4}
            style={{
              backgroundColor: "#1a1d20",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Form inline style={{display: "inline-flex", width: "95%"}}>
              <FormControl
                onChange={(e) => myAllChatsSearchHandler(e, user, myAllChats, dispatch)}
                type="text"
                placeholder="Search"
                style={{width: "95%", backgroundColor: "#343a40", borderRadius: "20px", border: "none", color: "white"}}
                className="mr-sm-2"
                name="manager"
                autoComplete="off"
              />
            </Form>
            <OverlayTrigger
              key="1"
              placement="top"
              overlay={
                <Tooltip id={"tooltip-right"}>
                  Create new <strong>Chat</strong>.
                </Tooltip>
              }
            >
              <Button variant="dark" onClick={() => dispatch(setSingleUserChatCreateModel())}>
                <i className="fas fa-plus"></i>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              key="2"
              placement="top"
              overlay={
                <Tooltip id={"tooltip-right"}>
                  Create new <strong>Group Chat</strong>.
                </Tooltip>
              }
            >
              <Button className="ml-2" variant="dark" onClick={() => dispatch(setGroupChatCreateModel())}>
                <i className="fas fa-users"></i>
              </Button>
            </OverlayTrigger>
          </Col>
          <Col
            className="px-3"
            xs={8}
            style={{
              backgroundColor: "#1a1d20",
              padding: "0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {selectedChat._id && (
              <>
                {selectedChat.isGroupChat ? (
                  <h5 style={{color: "white", marginBottom: "0px"}}>{selectedChat.chatName}</h5>
                ) : (
                  <h5 style={{color: "white", marginBottom: "0px"}}>{getSender(user.result, selectedChat.users)}</h5>
                )}
                <ChatProfileModal />
              </>
            )}
          </Col>
        </Row>
        <Row className="mx-5" style={{height: "66vh", flexWrap: "nowrap"}}>
          <Col xs={4} style={{backgroundColor: "#1d2124", padding: "0px", overflowX: "auto"}}>
            <div className="side-menu">
              <ul>
                {myAllChatsLoading ? (
                  <p style={{display: "flex", alignItems: "center", paddingTop: "200px", justifyContent: "center"}}>
                    <ClipLoader
                      loading={myAllChatsLoading}
                      speedMultiplier={2}
                      color={"white"}
                      css={btnoverride}
                      size={35}
                    />
                  </p>
                ) : (
                  filteredChats.map((chat, i) => (
                    <li className="side-menuLI" key={chat._id} style={{cursor: "pointer"}}>
                      <a
                        onClick={() => dispatch(setSelectedChat(chat))}
                        className="side-menuItems"
                        style={
                          selectedChat && selectedChat._id === chat._id
                            ? {backgroundColor: "#16191c"}
                            : {backgroundColor: "#1d2124"}
                        }
                      >
                        <Row style={{margin: "0px"}}>
                          <Col
                            sm={1}
                            style={{padding: "0px", display: "flex", justifyContent: "center", alignItems: "center"}}
                          >
                            {chat.isGroupChat ? (
                              <i className="fas fa-users mr-3" style={{width: "20px"}}></i>
                            ) : (
                              <i className="fas fa-user mr-3" style={{width: "20px"}}></i>
                            )}
                          </Col>
                          <Col sm={11}>
                            {chat.isGroupChat ? chat.chatName : getSender(user.result, chat.users)}
                            <span style={{float: "right", fontSize: "11px", opacity: "0.5"}}>
                              {moment(chat.updatedAt).fromNow()}
                            </span>
                            <p style={{fontSize: "12px", margin: "0px", opacity: "0.5"}}>
                              {chat.latestMessage
                                ? chat.isGroupChat
                                  ? `${chat.latestMessage.sender.firstName}: ${chat.latestMessage.content}`
                                  : chat.latestMessage.content
                                : "no messages yet"}
                            </p>
                          </Col>
                        </Row>
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </Col>
          <Col
            xs={8}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "5px",
              backgroundColor: "#343a40",
              width: "100%",
              height: "100%",
            }}
          >
            {selectedChat._id && (
              <>
                <MessagesBox />
                <div
                  className="emoji"
                  style={{
                    fontSize: "30px",
                    display: "flex",
                    flexDirection: "row",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  {showEmoji && (
                    <Picker onEmojiClick={handleEmojiClick} pickerStyle={{position: "absolute", bottom: "60px"}} />
                  )}
                  <BsEmojiSmileFill
                    onClick={emojiHideShowHandler}
                    style={{color: showEmoji && "#16191c", margin: "5px", marginRight: "8px"}}
                  ></BsEmojiSmileFill>
                  <FormControl
                    id="sendMessageInput"
                    value={messageToSend}
                    onChange={(e) => messageToSendTypingHandler(e, setMessageToSend)}
                    type="text"
                    placeholder="Enter your message here"
                    autoComplete="off"
                    style={{
                      width: "100%",
                      backgroundColor: "#1d2124",
                      borderRadius: "20px",
                      border: "none",
                      color: "white",
                      marginBottom: "8px",
                      padding: "10px",
                    }}
                    className="mr-sm-2"
                    onKeyDown={(event) =>
                      handleSendMessage(
                        event,
                        messageToSend,
                        setMessageToSend,
                        selectedChat,
                        myAllChats,
                        dispatch,
                        socket,
                        user
                      )
                    }
                    onClick={() => setShowEmoji(false)}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>

        {/* single user model */}

        <Modal
          show={singleChatModel}
          onHide={() => {
            dispatch(setfilteredAllOrgUsers(allOrgUsers));
            dispatch(setSingleUserChatCreateModel());
          }}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header style={{flexDirection: "column", alignItems: "center"}}>
            <span style={{margin: "14px", fontSize: "20px"}}>New Chat</span>
            <FormControl
              onChange={(e) => onAllOrgUsersSearchChange(e, user.result._id, allOrgUsers, dispatch)}
              type="text"
              placeholder="Search"
              style={{width: "100%", borderRadius: "20px"}}
              className="mr-sm-2"
              name="manager"
              autoComplete="off"
            />
          </Modal.Header>
          <Modal.Body style={{height: "300px", overflowX: "hidden", overflowY: "scroll"}}>
            {filteredAllOrgUsers.map((user, i) => (
              <Button
                key={user._id}
                onClick={() => {
                  dispatch(GetAsyncCreateSingleChat({userId: user._id, socket: socket}));
                  dispatch(setSingleUserChatCreateModel());
                  dispatch(setfilteredAllOrgUsers(allOrgUsers));
                }}
                className="my-1"
                variant="light"
                style={{display: "block", width: "100%", textAlign: "left"}}
              >
                <Row>
                  <Col sm={1} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <i className="far fa-user fa-2x mr-3"></i>
                  </Col>
                  <Col sm={11} style={{paddingTop: "14px"}}>
                    {user.firstName} {user.lastName}
                    <p style={{fontSize: "14px"}}>
                      <b>Email</b>: {user.email}
                    </p>
                  </Col>
                </Row>
              </Button>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                dispatch(setfilteredAllOrgUsers(allOrgUsers));
                dispatch(setSingleUserChatCreateModel());
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* single user model */}

        {/* create group model */}

        <Modal
          show={groupChatModel}
          onHide={() => {
            dispatch(setGroupChatCreateModel());
            setSelectedGroupUsers([]);
            dispatch(setfilteredAllOrgUsers(allOrgUsers));
          }}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header style={{display: "block"}}>
            <h4 style={{textAlign: "center", marginBottom: "30px"}}>Create New Group</h4>
            <FormControl
              onChange={(e) => onGroupNameChange(e)}
              type="text"
              placeholder="Group Name"
              style={{width: "100%", borderRadius: "20px"}}
              className="my-3 mr-5"
              name="manager"
              autoComplete="off"
            />
            <FormControl
              onChange={(e) => onAllOrgUsersSearchChange(e, user.result._id, allOrgUsers, dispatch)}
              type="text"
              placeholder="Search users to add"
              style={{width: "100%", borderRadius: "20px"}}
              className="my-3 mr-5"
              name="manager"
            />
            {selectedGroupUsers &&
              selectedGroupUsers.map((selectedUser) => (
                <Badge key={selectedUser._id} pill className="mx-1" variant="primary">
                  {selectedUser.firstName}
                  <span onClick={() => deleteSelectUser(selectedUser)} style={{cursor: "pointer"}}>
                    {" "}
                    <b>X</b>
                  </span>
                </Badge>
              ))}
          </Modal.Header>
          <Modal.Body style={{height: "300px", overflowX: "auto"}}>
            {filteredAllOrgUsers.map((users, i) => (
              <Button
                key={users._id}
                onClick={() => {
                  if (selectedGroupUsers.includes(users)) {
                    alert("User already selected");
                  } else {
                    setSelectedGroupUsers([...selectedGroupUsers, users]);
                  }
                }}
                className="my-1"
                variant="light"
                style={{display: "block", width: "100%", textAlign: "left"}}
              >
                <Row>
                  <Col sm={1} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <i className="far fa-user fa-2x mr-3"></i>
                  </Col>
                  <Col sm={11} style={{paddingTop: "14px"}}>
                    {users.firstName} {users.lastName}
                    <p style={{fontSize: "14px"}}>
                      <b>Email</b>: {users.email}
                    </p>
                  </Col>
                </Row>
              </Button>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() => {
                dispatch(
                  newGroupChatSubmit({groupName: groupName, selectedGroupUsers: selectedGroupUsers, socket: socket})
                );
                dispatch(setGroupChatCreateModel());
                setSelectedGroupUsers([]);
                dispatch(setfilteredAllOrgUsers(allOrgUsers));
              }}
            >
              Create Group
            </Button>
            <Button
              onClick={() => {
                dispatch(setGroupChatCreateModel());
                setSelectedGroupUsers([]);
                dispatch(setfilteredAllOrgUsers(allOrgUsers));
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* create group model */}
      </Container>
    </>
  );
};

export default Chats;
