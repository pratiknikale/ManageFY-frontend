import React, {useState, useEffect, useContext} from "react";
import {Badge, Button, Col, FormControl, Modal, Row} from "react-bootstrap";
import {getSender} from "../config/chatLogics";
import {RemoveGroupUser, RenameGroup, AddGroupUser, GetChats} from "../services/api";
import ClipLoader from "react-spinners/ClipLoader";
import {css} from "@emotion/react";
import {useSelector} from "react-redux";

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
  margin-left: 6px;
`;

const ChatProfileModal = ({selectedChat, allUsers, setSelectedChat, chats, setMychats, setFoundUsers}) => {
  useEffect(() => {
    // chats();
    // allChatUsers();
  }, []);

  const user = useSelector((state) => state.user.user);

  const [modalShow1, setModalShow1] = React.useState(false);
  // const [name, setName] = useState("");
  const [newGName, setNewGName] = useState("");
  const [foundToAddUsers, setFoundToAddUsers] = useState();
  const [userDelLoading, setUserDelLoading] = useState(false);
  const [groupRenameLoading, setGroupRenameLoading] = useState(false);

  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = allUsers.filter((user) => {
        const fname =
          user.firstName !== user.result.firstName && user.firstName.toLowerCase().includes(keyword.toLowerCase());

        const lname =
          user.lastName !== user.result.lastName && user.lastName.toLowerCase().includes(keyword.toLowerCase());

        return fname + lname;
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundToAddUsers(results);
    } else {
      setFoundToAddUsers("");
      // If the text field is empty, show all users
    }

    // setName(keyword);
  };

  const delAGroupUser = async (chatID, userID) => {
    // userID === user._id ? setSelectedChat() :
    setUserDelLoading(true);
    if (userID === user.result._id) {
      if (window.confirm("Are you sure you want to leave the group?") === true) {
        const result = RemoveGroupUser(chatID, userID);
        result.then(setSelectedChat()).then(chats());
      }
    } else {
      const {data} = await RemoveGroupUser(chatID, userID);
      setSelectedChat(data);
      chats();
    }

    setUserDelLoading(false);

    // console.log(data);
  };

  const onRenameGroupChange = (e) => {
    const newName = e.target.value;

    setNewGName(newName);
  };

  const renameGroupSubmit = async (chatID, NewGName) => {
    setGroupRenameLoading(true);
    const {data} = await RenameGroup(chatID, NewGName);
    setSelectedChat(data);
    // chats();
    const res = await GetChats();
    setMychats(res.data);
    setFoundUsers(res.data);
    setGroupRenameLoading(false);

    // console.log(data);
  };

  const addUserToGroup = async (chatID, userID) => {
    if (selectedChat.users.find((u) => u._id === userID)) {
      alert("user already exists");
    } else {
      setUserDelLoading(true);

      const {data} = await AddGroupUser(chatID, userID);
      setSelectedChat(data);
      chats();
      setUserDelLoading(false);
    }
  };

  return (
    <>
      <Button variant="dark" style={{float: "right"}} onClick={() => setModalShow1(true)}>
        <i className="fas fa-ellipsis-v"></i>
      </Button>

      <Modal
        show={modalShow1}
        onHide={() => setModalShow1(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header style={{display: "block"}}>
          {selectedChat.isGroupChat ? (
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
              <Badge key={selectedUsers._id} pill className="mx-1" variant="primary">
                {selectedUsers.firstName}
                <span onClick={() => delAGroupUser(selectedChat._id, selectedUsers._id)} style={{cursor: "pointer"}}>
                  {" "}
                  <b>X</b>
                </span>
              </Badge>
            ))}
          {userDelLoading && (
            <ClipLoader loading={userDelLoading} speedMultiplier={2} color={"blue"} css={btnoverride} size={17} />
          )}
        </Modal.Header>
        <Modal.Body>
          {selectedChat.isGroupChat && (
            <>
              <div style={{display: "flex", alignItems: "center"}}>
                <FormControl
                  onChange={(e) => onRenameGroupChange(e)}
                  type="text"
                  placeholder="Rename Group"
                  style={{width: "100%", borderRadius: "20px"}}
                  className="my-3 mr-2"
                  //   name="manager"
                />
                <Button
                  variant="success"
                  style={{width: "130px"}}
                  onClick={() => renameGroupSubmit(selectedChat._id, newGName)}
                >
                  Update
                </Button>
              </div>
              <div style={{display: "flex", alignItems: "center"}}>
                <FormControl
                  onChange={filter}
                  type="text"
                  placeholder="Search New User to add"
                  style={{width: "100%", borderRadius: "20px"}}
                  className="my-3 mr-2"
                  //   name="manager"
                />
              </div>
              <Modal.Body style={{maxHeight: "170px", overflowX: "auto"}}>
                {foundToAddUsers &&
                  foundToAddUsers.map((users, i) => (
                    <Button
                      key={users._id}
                      onClick={() => addUserToGroup(selectedChat._id, users._id)}
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
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedChat.isGroupChat && (
            <Button onClick={() => delAGroupUser(selectedChat._id, user.result._id)} variant="danger">
              Leave Group
            </Button>
          )}
          <Button onClick={() => setModalShow1(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChatProfileModal;
