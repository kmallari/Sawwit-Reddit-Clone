var express = require("express");
var router = express.Router();

const { userUpload } = require("../utils/storage");
const db = require("../utils/db.config.js");
const usersRepository = require("../repositories/users.repository.js")(db);

const userController = require("../controllers/user.controller.js")(
  usersRepository
);

router.get("/", userController.getAllUsers);
router.get("/search", userController.searchUser);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/:userId", userController.getUser);
router.patch(
  "/:userId",
  userUpload.single("profilePicture"),
  userController.updateUser
);
router.delete("/:userId", userController.deleteUser);

module.exports = router;
