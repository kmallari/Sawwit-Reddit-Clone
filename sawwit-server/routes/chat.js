const express = require("express");
const router = express.Router();
const db = require("../utils/db.config.js");
const chatRepository = require("../repositories/chat.repository.js")(db);
const chatController = require("../controllers/chat.controller.js")(
  chatRepository
);

router.post("/", chatController.createRoom);
router.post("/createMessage", chatController.createMessage);
router.get("/users/:userId", chatController.getRoomsUserIsIn);
router.get("/invite/user/:userId", chatController.getUserRoomInvitations);
router.post("/invite/room/:roomId", chatController.inviteMultipleUsersToRoom);
router.post(
  "/invite/room/:roomId/response",
  chatController.respondToInvitation
);
router.get("/:roomId", chatController.getRoomInfo);
router.get("/:roomId/messages", chatController.getRoomMessages);
router.put("/:roomId", chatController.changeRoomName);

module.exports = router;
