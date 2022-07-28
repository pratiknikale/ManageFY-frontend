import {myAllChatsSearchFilter, resetSortAllChats} from "../features/chat/chatSlice";
import {SendAsyncSelectedChatMessage} from "../features/chat/messagesSlice";
import {setfilteredAllOrgUsers} from "../features/user/userSlice";

export const myAllChatsSearchHandler = (e, user, myAllChats, dispatch) => {
  // handler for chats search
  e.preventDefault();

  let chatUsers = myAllChats.map((chat) => {
    if (chat.isGroupChat) {
      if (chat.chatName.toLowerCase().includes(e.target.value.toLowerCase())) {
        return chat;
      }
    } else {
      let userOtherThanLogged = chat.users.filter((notLoggedUser) => {
        return notLoggedUser.firstName !== user.result.firstName;
      });

      if (
        userOtherThanLogged[0].firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        userOtherThanLogged[0].lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        userOtherThanLogged[0].email.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return chat;
      }
    }
  });

  let filteredChatResult = chatUsers.filter((chat) => {
    return chat !== undefined;
  });

  if (e.target.value.length > 0) {
    dispatch(myAllChatsSearchFilter(filteredChatResult));
  } else {
    dispatch(myAllChatsSearchFilter(myAllChats));
  }
};

export const handleSendMessage = async (event, messageToSend, setMessageToSend, selectedChat, myAllChats, dispatch) => {
  if (event.key === "Enter") {
    dispatch(
      SendAsyncSelectedChatMessage({
        content: messageToSend,
        chatId: selectedChat._id,
      })
    ); //sends message to specified chat id

    // returns an array of chats with removed selected chat from it so that to add selected chat on the top
    let popedSelectedChatArray = await myAllChats.filter((chat) => {
      return selectedChat !== chat;
    });
    dispatch(resetSortAllChats({selectedChat: selectedChat, popedSelectedChatArray: popedSelectedChatArray})); // adds selected chat on the top chats Array

    setMessageToSend(""); //clears to send message state
    document.getElementById("sendMessageInput").value = ""; //clears the send message input field
  }
};

export const messageToSendTypingHandler = (e, setMessageToSend) => {
  e.preventDefault();
  setMessageToSend(e.target.value);
};

export const onAllOrgUsersSearchChange = async (e, loggedUserId, allOrgUsers, dispatch) => {
  e.preventDefault();

  if (e.target.value.length < 1) {
    dispatch(setfilteredAllOrgUsers(allOrgUsers));
  } else {
    const userFilteredResult = await allOrgUsers.filter((user) => {
      return user.firstName.includes(e.target.value);
    });

    const userFilteredResultRemovedLoggedUser = await userFilteredResult.filter((user) => {
      return loggedUserId !== user._id;
    });

    dispatch(setfilteredAllOrgUsers(userFilteredResultRemovedLoggedUser));
  }
};
