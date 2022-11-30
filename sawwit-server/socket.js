const nanoid = require("nanoid");
module.exports = (io, chatRepository) => {
  io.on("connection", (socket) => {
    console.log("A user connected!");

    let previousRoomId = null;

    socket.on("joinRoom", async (userId, roomId) => {
      console.log(`Attempting to join room ${roomId}`);
      const sockitID = socket.id;
      console.log(sockitID);

      try {
        const data = await chatRepository.checkIfUserIsInRoom(userId, roomId);
        if (data[0][0].length >= 1) {
          if (previousRoomId) {
            console.log("Left room " + previousRoomId);
            socket.leave(previousRoomId);
          }
          socket.join(roomId);
          previousRoomId = roomId;
          console.log("Room joined successfully.");
        } else {
          console.log("User is not in the room.");
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("sendMessage", async (user, roomId, message) => {
      // await adding messages to db
      const chatId = nanoid.nanoid();
      const createdAt = Date.now();
      try {
        const data = await chatRepository.createMessage(
          chatId,
          user.id,
          user.username,
          user.profilePicture,
          roomId,
          message,
          createdAt,
          createdAt
        );

        io.to(roomId).emit("receiveMessage", data[0][0][0]);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected!");
    });
  });
};
