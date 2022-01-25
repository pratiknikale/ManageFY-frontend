import React, {useState, useEffect, useContext} from "react";
import {Button, Container, Form, FormControl, Row, Col, OverlayTrigger, Tooltip, Modal, Badge} from "react-bootstrap";
import {
  GetChats,
  getAllUsers,
  searchAllUser,
  GetSingleChats,
  CreateGroup,
  getMessages,
  sendMessages,
} from "../services/api";
import {AppContext} from "../App";
import {getSender} from "../config/chatLogics";
import ChatProfileModal from "../mycomponents/ChatProfileModal";
import MessagesBox from "../mycomponents/MessagesBox";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import {css} from "@emotion/react";
import io from "socket.io-client";

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
  margin-left: 6px;
`;

// const ENDPOINT = "http://localhost:8000";
const ENDPOINT = "https://mytodo-mern-app.herokuapp.com";
var socket, selectedChatCompare;

const Chats = () => {
  const {isUser} = useContext(AppContext);

  const [mychats, setMychats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow1, setModalShow1] = React.useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [chatsLoading, setChatsLoading] = useState(false);
  const [sendMessagesLoader, setSendMessagesLoader] = useState(false);
  const [messagesLoader, setmessagesLoader] = useState(false);

  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("chatSetup", isUser.result);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    chats();
    allChatUsers();
    // console.log(isUser);
    //   getAllEmployeeList().then(() => {
    //     setIsNewEmployeeLoadingList(false);
    //   });
  }, []);

  useEffect(() => {
    getChatMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        console.log("notification");

        //   give notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const getChatMessages = async () => {
    if (selectedChat) {
      setmessagesLoader(true);
      const chatId = selectedChat._id;
      const {data} = await getMessages(chatId);
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
      //   console.log(messages);
    }
    setmessagesLoader(false);
  };

  const allChatUsers = async () => {
    const {data} = await getAllUsers();
    setAllUsers(data);
    // console.log(data);
  };

  const chats = async () => {
    setChatsLoading(true);
    const {data} = await GetChats();
    setMychats(data);
    setFoundUsers(data);
    setChatsLoading(false);
    // console.log(data);
  };

  const onAllUsersSearchChange = async (e) => {
    const search = e.target.value;
    const {data} = await searchAllUser(search);
    setAllUsers(data);
    // console.log(data);
  };

  const getSingleChat = async (userId) => {
    const {data} = await GetSingleChats(userId);

    if (
      mychats
        .map(
          (chat) =>
            chat.users[0].firstName === data.users[0].firstName && chat.users[1].firstName === data.users[1].firstName
        )
        .includes(true)
    ) {
      alert("chat already exists");
    } else {
      setMychats([data, ...mychats]);
      setFoundUsers([data, ...foundUsers]);
      setSelectedChat(data);
      // chats();
      setModalShow(false);
    }
  };

  const [name, setName] = useState("");
  const [foundUsers, setFoundUsers] = useState(mychats);

  //change to filter of every search field (manageManager, manageEmployee, chat Alluser search)
  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = mychats.filter((user) => {
        const fname0 =
          !user.isGroupChat &&
          user.users[0].firstName !== isUser.result.firstName &&
          user.users[0].firstName.toLowerCase().includes(keyword.toLowerCase());
        const fname1 =
          !user.isGroupChat &&
          user.users[1].firstName !== isUser.result.firstName &&
          user.users[1].firstName.toLowerCase().includes(keyword.toLowerCase());
        const lname0 =
          !user.isGroupChat &&
          user.users[0].lastName !== isUser.result.firstName &&
          user.users[0].lastName.toLowerCase().includes(keyword.toLowerCase());
        const lname1 =
          !user.isGroupChat &&
          user.users[1].lastName !== isUser.result.firstName &&
          user.users[1].lastName.toLowerCase().includes(keyword.toLowerCase());

        const cName = user.isGroupChat && user.chatName.toLowerCase().includes(keyword.toLowerCase());
        return fname0 + fname1 + lname0 + lname1 + cName;
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundUsers(results);
    } else {
      setFoundUsers(mychats);
      // If the text field is empty, show all users
    }

    setName(keyword);
  };

  const onGroupNameChange = (e) => {
    const GroupName = e.target.value;
    setNewGroupName(GroupName);
  };

  const selectUser = (userToAdd) => {
    if (selectedGroupUsers.includes(userToAdd)) {
      alert("already user exist"); // add toast later
    } else {
      setSelectedGroupUsers([...selectedGroupUsers, userToAdd]);
      // console.log(selectedGroupUsers);
    }
  };

  const deleteSelectUser = (userToDel) => {
    setSelectedGroupUsers(selectedGroupUsers.filter((sel) => sel._id !== userToDel._id));
  };

  const newGroupSubmit = async () => {
    if (newGroupName === "") {
      alert("Enter Group Name");
    } else if (selectedGroupUsers.length < 2) {
      alert("Group should exist more than 2 users");
    } else {
      const gName = newGroupName;
      const gUsers = JSON.stringify(selectedGroupUsers.map((u) => u._id));

      const {data} = await CreateGroup(gName, gUsers);
      setMychats([data, ...mychats]);
      setFoundUsers([data, ...foundUsers]);
      setSelectedChat(data);
      setModalShow1(false);

      //   console.log(newGroupName);
      //   console.log(selectedGroupUsers);
    }
  };

  const typingHandler = (e) => {
    setMessageToSend(e.target.value);
    // console.log(messageToSend);
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && messageToSend) {
      setSendMessagesLoader(true);
      document.getElementById("sendMessageInput").value = "";
      const {data} = await sendMessages(messageToSend, selectedChat._id);
      //   console.log(data);
      setMessageToSend("");
      setSendMessagesLoader(false);
      socket.emit("new message", data);
      setMessages([...messages, data]);
      const res = await GetChats();
      setMychats(res.data);
      setFoundUsers(res.data);
    }
  };

  //   selectedChat && console.log(selectedChat._id);

  return (
    <>
      <h4 style={{marginTop: "25px", marginBottom: "25px", marginLeft: "25px", color: "white"}}>Chats</h4>

      <Container fluid>
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
                value={name}
                onChange={filter}
                type="text"
                placeholder="Search"
                style={{width: "95%", backgroundColor: "#343a40", borderRadius: "20px", border: "none", color: "white"}}
                className="mr-sm-2"
                name="manager"
              />
              {/* <Button variant="outline-success">Search</Button> */}
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
              <Button variant="dark" onClick={() => setModalShow(true)}>
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
              <Button className="ml-2" variant="dark" onClick={() => setModalShow1(true)}>
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
            {selectedChat && (
              <>
                {selectedChat.isGroupChat ? (
                  <h5 style={{color: "white", marginBottom: "0px"}}>{selectedChat.chatName}</h5>
                ) : (
                  <h5 style={{color: "white", marginBottom: "0px"}}>{getSender(isUser.result, selectedChat.users)}</h5>
                )}
                <ChatProfileModal
                  chats={chats}
                  setSelectedChat={setSelectedChat}
                  allUsers={allUsers}
                  selectedChat={selectedChat}
                  setMychats={setMychats}
                  setFoundUsers={setFoundUsers}
                />
              </>
            )}
          </Col>
        </Row>
        <Row className="mx-5" style={{height: "66vh", flexWrap: "nowrap"}}>
          <Col xs={4} style={{backgroundColor: "#1d2124", padding: "0px", overflowX: "auto"}}>
            <div className="side-menu">
              <ul>
                {chatsLoading ? (
                  <p style={{display: "flex", alignItems: "center", paddingTop: "200px", justifyContent: "center"}}>
                    <ClipLoader
                      loading={chatsLoading}
                      speedMultiplier={2}
                      color={"white"}
                      css={btnoverride}
                      size={35}
                    />
                  </p>
                ) : (
                  foundUsers.map((chat, i) => (
                    <li className="side-menuLI" key={chat._id} style={{cursor: "pointer"}}>
                      <a
                        onClick={() => setSelectedChat(chat)}
                        // onClick={() => openChat(chat)}
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
                            {chat.isGroupChat ? chat.chatName : getSender(isUser.result, chat.users)}
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
            <MessagesBox
              selectedChat={selectedChat}
              messages={messages}
              sendMessagesLoader={sendMessagesLoader}
              getChatMessages={getChatMessages}
              messagesLoader={messagesLoader}
              selectedChatCompare={selectedChatCompare}
              socket={socket}
              setMessages={setMessages}
              ENDPOINT={ENDPOINT}
            />
            {selectedChat && (
              <FormControl
                id="sendMessageInput"
                onChange={typingHandler}
                type="text"
                placeholder="Enter your message here"
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
                onKeyDown={sendMessage}
              />
            )}
          </Col>
        </Row>

        {/* single user model */}

        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <FormControl
              onChange={(e) => onAllUsersSearchChange(e)}
              type="text"
              placeholder="Search"
              style={{width: "95%", borderRadius: "20px"}}
              className="mr-sm-2"
              name="manager"
            />
          </Modal.Header>
          <Modal.Body style={{height: "300px", overflowX: "auto"}}>
            {allUsers.map((users, i) => (
              <Button
                key={users._id}
                onClick={() => getSingleChat(users._id)}
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
            <Button onClick={() => setModalShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* single user model */}

        {/* create group model */}

        <Modal
          show={modalShow1}
          onHide={() => setModalShow1(false)}
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
            />
            <FormControl
              onChange={(e) => onAllUsersSearchChange(e)}
              type="text"
              placeholder="Search users to add"
              style={{width: "100%", borderRadius: "20px"}}
              className="my-3 mr-5"
              name="manager"
            />
            {selectedGroupUsers &&
              selectedGroupUsers.map((selectedUsers) => (
                <Badge key={selectedUsers._id} pill className="mx-1" variant="primary">
                  {selectedUsers.firstName}
                  <span onClick={() => deleteSelectUser(selectedUsers)} style={{cursor: "pointer"}}>
                    {" "}
                    <b>X</b>
                  </span>
                </Badge>
              ))}
          </Modal.Header>
          <Modal.Body style={{height: "300px", overflowX: "auto"}}>
            {allUsers.map((users, i) => (
              <Button
                key={users._id}
                onClick={() => selectUser(users)}
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
            <Button variant="success" onClick={newGroupSubmit}>
              Create Group
            </Button>
            <Button onClick={() => setModalShow1(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* create group model */}
      </Container>
    </>
  );
};

export default Chats;
