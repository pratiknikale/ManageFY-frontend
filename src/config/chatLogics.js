export const getSender = (loggedUser, user) => {
  return user[0]._id === loggedUser._id
    ? user[1].firstName + " " + user[1].lastName
    : user[0].firstName + " " + user[0].lastName;
};

export const getSenderId = (loggedUser, user) => {
  return user[0]._id === loggedUser._id ? user[1]._id : user[0]._id;
};
