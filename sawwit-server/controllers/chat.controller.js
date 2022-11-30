const nanoid = require("nanoid");

module.exports = (chatRepository) => {
  const chatController = {
    getRoomInfo: async (req, res) => {
      const roomId = req.params.roomId;
      const data = await chatRepository.getRoomInfo(roomId);
      const participants = await chatRepository.getRoomParticipants(roomId);

      res.status(200).json({
        roomInfo: {
          ...data[0][0][0],
        },
        participants: participants[0][0],
      });
    },
    createRoom: async (req, res) => {
      try {
        let { roomName, invitor } = req.body;
        const roomId = nanoid.nanoid();
        if (!roomName) {
          roomName = invitor.username + "'s room";
        }
        const createdAt = Date.now();

        if (!invitor) throw new Error("No invitor");

        await chatRepository.createRoom(
          roomId,
          roomName,
          "https://i.imgur.com/L9Xt17O.png",
          createdAt
        );

        await chatRepository.addToRoom(
          roomId,
          invitor.id,
          invitor.username,
          invitor.profilePicture,
          createdAt
        );

        res.status(200).json({
          message: "Room created successfully.",
          id: roomId,
          createdAt: createdAt,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
    createMessage: async (req, res) => {
      const { user, roomId, message } = req.body;
      const chatId = nanoid.nanoid();
      const createdAt = Date.now();
      try {
        await chatRepository.createMessage(
          chatId,
          user.id,
          user.username,
          user.profilePicture,
          roomId,
          message,
          createdAt
        );

        res.status(200).json({
          id: chatId,
          user: user,
          roomId: roomId,
          message: message,
          createdAt: createdAt,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
    getRoomsUserIsIn: async (req, res) => {
      const { userId } = req.params;
      const { start, limit } = req.query;

      try {
        const data = await chatRepository.getRoomsUserIsIn(
          userId,
          start,
          limit
        );
        res.status(200).json({ data: data[0][0] });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
    getRoomMessages: async (req, res) => {
      const { roomId } = req.params;
      const { start, limit } = req.query;
      const page = (start - 1) * limit;

      try {
        const data = await chatRepository.getRoomMessages(roomId, page, limit);
        res.status(200).json({ data: data[0][0] });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
    getUserRoomInvitations: async (req, res) => {
      const { userId } = req.params;
      const { start, limit } = req.query;
      try {
        const data = await chatRepository.getUserRoomInvitations(
          userId,
          start,
          limit
        );
        res.status(200).json({ data: data[0] });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
    inviteMultipleUsersToRoom: async (req, res) => {
      const { roomId } = req.params;
      const { users, invitor, roomName, roomImage } = req.body;

      // console.log(users, invitor, roomName, roomImage);

      const createdAt = Date.now();
      try {
        if (users && users.length > 0 && invitor && roomName && roomImage) {
          for (const user of users) {
            const inviteChecker =
              await chatRepository.checkIfUserHasBeenInvited(user.id, roomId);

            if (inviteChecker[0][0][0]) {
              throw new Error(
                `User ${user.username} has already been invited to this room.`
              );
            }

            const participantChecker = await chatRepository.checkIfUserIsInRoom(
              user.id,
              roomId
            );

            if (participantChecker[0][0][0]) {
              throw new Error(`User ${user.username} is already in this room.`);
            }

            await chatRepository.inviteUserToRoom(
              user.id,
              invitor.id,
              invitor.username,
              roomId,
              roomName,
              roomImage,
              createdAt
            );
          }
          res.status(200).json({ message: "Users invited successfully." });
        } else {
          throw new Error("Missing required fields.");
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
    respondToInvitation: async (req, res) => {
      const { user, accept } = req.body;
      const { roomId } = req.params;

      // console.log(user, roomId, accept);

      const createdAt = Date.now();
      try {
        if (accept) {
          await chatRepository.addToRoom(
            roomId,
            user.id,
            user.username,
            user.profilePicture,
            createdAt
          );
        }
        await chatRepository.deleteInvitation(user.id, roomId);
        res.status(200).json({
          message: "Invitation response sent successfully.",
          accept,
          roomId,
          user,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
    changeRoomName: async (req, res) => {
      try {
        const { roomId } = req.params;
        const { roomName } = req.body;
        const updatedAt = Date.now();
        if (roomName) {
          await chatRepository.changeRoomName(roomId, roomName, updatedAt);
          res.status(200).json({
            message: "Room name changed successfully.",
            roomId,
            newRoomName: roomName,
          });
        } else {
          throw new Error("Missing required fields.");
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    },
  };
  return chatController;
};
