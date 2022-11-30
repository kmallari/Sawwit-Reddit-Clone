var express = require("express");
var router = express.Router();

const { subredditUpload } = require("../utils/storage");
const db = require("../utils/db.config.js");
const subredditsRepository =
  require("../repositories/subreddits.repository.js")(db);
const subredditController = require("../controllers/subreddit.controller.js")(
  subredditsRepository
);

router.get("/", subredditController.getAllSubreddits);
router.get("/recent", subredditController.getRecentlyCreatedSubreddits);
router.get("/search", subredditController.searchSubreddit);
router.get("/:subreddit", subredditController.getSubredditInfo);
router.post("/", subredditController.postSubreddit);
router.patch(
  "/:subreddit",
  subredditUpload.single("icon"),
  subredditController.updateSubreddit
);

module.exports = router;
