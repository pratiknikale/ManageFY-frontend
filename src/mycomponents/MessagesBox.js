import React, {useEffect, useState} from "react";
import ScrollableFeed from "react-scrollable-feed";
import {css} from "@emotion/react";
import {ClipLoader} from "react-spinners";
import {useSelector, useDispatch} from "react-redux";
import {fetchAsyncSelectedChatMessages} from "../features/chat/messagesSlice";

// import io from "socket.io-client";

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
  margin-left: 6px;
`;

const MessagesBox = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user); // loggedin user data

  // loaders
  const messagesLoader = useSelector((state) => state.messages.messagesLoader);
  const sentMessagesLoader = useSelector((state) => state.messages.sentMessagesLoader);
  // loaders

  // data
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const selectedChatMessages = useSelector((state) => state.messages.messages);
  // data

  useEffect(() => {
    dispatch(fetchAsyncSelectedChatMessages(selectedChat._id));
  }, [selectedChat._id]);

  return (
    <div style={{overflowY: "auto", display: "flex", flexDirection: "column", paddingBottom: "10px"}}>
      <ScrollableFeed>
        {messagesLoader ? (
          <p style={{display: "flex", alignItems: "center", paddingTop: "70px", justifyContent: "center"}}>
            <ClipLoader loading={messagesLoader} speedMultiplier={2} color={"white"} css={btnoverride} size={35} />
          </p>
        ) : (
          selectedChatMessages.length > 0 &&
          selectedChatMessages.map((messages) => (
            <div style={{display: "flex"}} key={messages._id}>
              <span
                style={{
                  backgroundColor: `${messages.sender._id === user.result._id ? "black" : "#1d212491"}`,
                  padding: "5px",
                  margin: "5px",
                  color: "white",
                  borderRadius: "10px",
                  maxWidth: "350px",
                  marginLeft: `${messages.sender._id === user.result._id ? "auto" : "10px"}`,
                  marginRight: `${messages.sender._id === user.result._id ? "15px" : "0px"}`,
                }}
              >
                {messages.chat.isGroupChat && messages.sender._id !== user.result._id && (
                  <span style={{display: "block", fontSize: "12px", opacity: "0.5"}}>{messages.sender.firstName}</span>
                )}

                {messages.content}
              </span>
            </div>
          ))
        )}

        {sentMessagesLoader && (
          <div style={{display: "flex"}}>
            <span
              style={{
                backgroundColor: "black",
                padding: "5px",
                margin: "5px",
                color: "white",
                borderRadius: "10px",
                marginLeft: "auto",
                marginRight: "15px",
              }}
            >
              <p style={{display: "flex", justifyContent: "center", alignItems: "center", margin: "0px"}}>
                <ClipLoader
                  loading={sentMessagesLoader}
                  speedMultiplier={2}
                  color={"white"}
                  css={btnoverride}
                  size={22}
                />
              </p>
            </span>
          </div>
        )}
        {/* {isTyping && (
          <div style={{display: "flex"}}>
            <span
              style={{
                backgroundColor: "grey",
                padding: "5px",
                margin: "5px",
                color: "black",
                borderRadius: "10px",
                marginLeft: "10px",
                marginRight: "0px",
              }}
            >
              typing . . .
            </span>
          </div>
        )} */}
      </ScrollableFeed>
    </div>
  );
};

export default MessagesBox;
