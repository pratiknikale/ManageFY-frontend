import React, {useEffect, useContext, useState} from "react";
import {getMessages} from "../services/api";
import {AppContext} from "../App";
import ScrollableFeed from "react-scrollable-feed";
import {css} from "@emotion/react";
import {ClipLoader} from "react-spinners";
// import io from "socket.io-client";

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
  margin-left: 6px;
`;

const MessagesBox = ({
  //   selectedChat,
  messages,
  sendMessagesLoader,
  //   getChatMessages,
  messagesLoader,
  //   selectedChatCompare,
  //   socket,
  //   setMessages,
  //   ENDPOINT,
}) => {
  const {isUser} = useContext(AppContext);

  return (
    <div style={{overflowY: "auto", display: "flex", flexDirection: "column", paddingBottom: "10px"}}>
      <ScrollableFeed>
        {messagesLoader ? (
          <p style={{display: "flex", alignItems: "center", paddingTop: "70px", justifyContent: "center"}}>
            <ClipLoader loading={messagesLoader} speedMultiplier={2} color={"white"} css={btnoverride} size={35} />
          </p>
        ) : (
          messages &&
          messages.map((messages) => (
            <div style={{display: "flex"}} key={messages._id}>
              <span
                style={{
                  backgroundColor: `${messages.sender._id === isUser.result._id ? "black" : "#1d212491"}`,
                  padding: "5px",
                  margin: "5px",
                  color: "white",
                  borderRadius: "10px",
                  marginLeft: `${messages.sender._id === isUser.result._id ? "auto" : "10px"}`,
                  marginRight: `${messages.sender._id === isUser.result._id ? "15px" : "0px"}`,
                }}
              >
                {messages.chat.isGroupChat && messages.sender._id !== isUser.result._id && (
                  <span style={{display: "block", fontSize: "12px", opacity: "0.5"}}>{messages.sender.firstName}</span>
                )}

                {messages.content}
              </span>
            </div>
          ))
        )}
        {sendMessagesLoader && (
          <div style={{display: "flex"}} key={messages._id}>
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
                  loading={sendMessagesLoader}
                  speedMultiplier={2}
                  color={"white"}
                  css={btnoverride}
                  size={22}
                />
              </p>
            </span>
          </div>
        )}
      </ScrollableFeed>
    </div>
  );
};

export default MessagesBox;
