var express = require("express");
var router = express.Router();
const { postUpload } = require("../utils/storage");
const db = require("../utils/db.config.js");
const redis = require("../utils/redis.config");

const postsRepository = require("../repositories/posts.repository.js")(db);
const postController = require("../controllers/post.controller.js")(
  postsRepository
);

const commentsRepository = require("../repositories/comments.repository.js")(
  db,
  redis
);
const commentController = require("../controllers/comment.controller.js")(
  commentsRepository
);

router.get("/", postController.getAllPosts);
router.get("/pagination", postController.getAllPostsUsingPagination);
router.get("/subreddit/:subreddit", postController.getPostsFromSubreddit);
router.get(
  "/subreddit/:subreddit/pagination",
  postController.getSubredditPostsUsingPagination
);
router.get("/user/:userId", postController.getUserPosts);
router.get("/user/:userId/pagination", postController.getUserPostsUsingPagination);
router.post("/submit", postUpload.single("imgFile"), postController.createPost);
router.get("/:postId", postController.getOnePost);
router.post("/:postId", postController.votePost);
router.put("/:postId", postController.putPost);
router.delete("/:postId", postController.deletePost);

// comments
router.post("/:postId/comments", commentController.postComment);
router.get(
  "/:postId/parentComments",
  commentController.getParentCommentsFromPost
);
router.get("/:postId/comments", commentController.getPostComments);
router.get("/:postId/comments/next", commentController.getNextComments);
router.get("/:postId/comments/:commentId", commentController.getOneComment);
router.post("/:postId/comments/:commentId", commentController.voteComment);
router.put("/:postId/comments/:commentId", commentController.putComment);
router.delete("/:postId/comments/:commentId", commentController.deleteComment);

module.exports = router;
