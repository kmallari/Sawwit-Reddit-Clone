module.exports = (db) => {
  const messagesRepository = {
    getRoomInfo: (roomId) => {
      return db.raw("CALL GetRoomInfo(?)", [roomId]);
    },
    createRoom: (id, name, roomImage, createdAt) => {
      return db.raw("CALL CreateRoom(?, ?, ?, ?)", [
        id,
        name,
        roomImage,
        createdAt,
      ]);
    },
    createMessage: (
      id,
      senderId,
      senderUsername,
      senderProfilePicture,
      roomId,
      message,
      createdAt
    ) => {
      return db.raw("CALL CreateMessage(?, ?, ?, ?, ?, ?, ?, ?)", [
        id,
        senderId,
        senderUsername,
        senderProfilePicture,
        roomId,
        message,
        createdAt,
        createdAt,
      ]);
    },
    checkIfUserIsInRoom: (userId, roomId) => {
      return db.raw("CALL CheckIfUserIsInRoom(?, ?)", [userId, roomId]);
    },
    getRoomMessages: (roomId, start, items) => {
      return db.raw("CALL GetRoomMessages(?, ?, ?)", [roomId, start, items]);
    },
    addToRoom: (roomId, userId, username, userProfilePicture, createdAt) => {
      return db.raw("CALL AddToRoom(?, ?, ?, ?, ?)", [
        roomId,
        userId,
        username,
        userProfilePicture,
        createdAt,
      ]);
    },
    getRoomParticipants: (roomId) => {
      return db.raw("CALL GetRoomParticipants(?)", [roomId]);
    },
    getRoomsUserIsIn: (userId, start, end) => {
      return db.raw("CALL GetRoomsUserIsIn(?, ?, ?)", [userId, start, end]);
    },
    getUserRoomInvitations: (userId, start, items) => {
      return db.raw("CALL GetUserInvitations(?, ?, ?)", [userId, start, items]);
    },
    inviteUserToRoom: (
      userId,
      invitedById,
      invitedByUsername,
      roomId,
      roomName,
      roomImage,
      createdAt
    ) => {
      return db.raw("CALL InviteUserToRoom(?, ?, ?, ?, ?, ?, ?)", [
        userId,
        invitedById,
        invitedByUsername,
        roomId,
        roomName,
        roomImage,
        createdAt,
      ]);
    },
    deleteInvitation: (userId, roomId) => {
      return db.raw("CALL DeleteInvitation(?, ?)", [userId, roomId]);
    },
    checkIfUserHasBeenInvited: (userId, roomId) => {
      return db.raw("CALL CheckIfUserHasBeenInvited(?, ?)", [userId, roomId]);
    },
    changeRoomName: (roomId, name, updatedAt) => {
      return db.raw("CALL ChangeRoomName(?, ?, ?)", [roomId, name, updatedAt]);
    },
  };
  return messagesRepository;
};
