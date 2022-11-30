const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const postsRouter = require("./posts");
const subredditRouter = require("./subreddits");
const chatRouter = require("./chat");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ Site: "Reddit clone!" });
});

// TO DO:
// GIVE ERROR MESSAGE WHEN NO POSTS/COMMENTS/USER/SUBREDDIT FOUND.
// AS OF NOW, IT JUST RETURNS AN EMPTY ARRAY.
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/subreddits", subredditRouter);
router.use("/chat", chatRouter);

module.exports = router;
