module.exports = (db, redis) => {
  const commentsRepository = {
    getAllComments: () => {
      return db.raw("CALL GetAllComments()");
    },
    createComment: (
      id,
      userId,
      username,
      userProfilePicture,
      postId,
      parentId,
      body,
      createdAt,
      parentLevel
    ) => {
      return db.raw("CALL CreateComment(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        id,
        userId,
        username,
        userProfilePicture,
        postId,
        parentId,
        body,
        createdAt,
        parentLevel,
      ]);
    },
    getPostComments: (postId, loggedInUserId) => {
      return db.raw("CALL GetPostComments(?, ?)", [postId, loggedInUserId]);
    },
    getNextComments: (parentId, loggedInUserId) => {
      return db.raw("CALL GetNextComments(?, ?)", [parentId, loggedInUserId]);
    },
    deleteComment: (id) => {
      return db.raw("CALL DeleteComment(?)", [id]);
    },
    getOneComment: (id) => {
      return db.raw("CALL GetOneComment(?)", [id]);
    },
    changeComment: (id, body) => {
      return db.raw("CALL ChangeComment(?, ?)", [id, body]);
    },
    checkIfCommentExists: (id) => {
      return db.raw("CALL CheckIfCommentExists(?)", [id]);
    },
    checkIfPostExists: (postId) => {
      return db.raw("CALL CheckIfPostExists(?)", [postId]);
    },
    checkIfUserExists: (id) => {
      return db.raw("CALL CheckIfIDExists(?)", [id]);
    },
    checkIfUserHasVoted: (userId, commentId) => {
      return db.raw("CALL CheckIfUserVotedComment(?, ?)", [userId, commentId]);
    },
    voteComment: (userId, commentId, vote) => {
      return db.raw("CALL CreateCommentVote(?, ?, ?)", [
        userId,
        commentId,
        vote,
      ]);
    },
    deleteVote: (userId, commentId) => {
      return db.raw("CALL DeleteCommentVote(?, ?)", [userId, commentId]);
    },
    decrementCommentUpvote: (commentId) => {
      return db.raw("CALL DecrementCommentUpvote(?)", [commentId]);
    },
    decrementCommentDownvote: (commentId) => {
      return db.raw("CALL DecrementCommentDownvote(?)", [commentId]);
    },
    setParentCommentsToCache: (postId, level, parentId, comments) => {
      const pipeline = redis.pipeline();
      const commentsObj = { parentId: parentId, childrenComments: comments };
      pipeline.zadd(postId, level, JSON.stringify(commentsObj));
      pipeline.expire(postId, 30);
      return pipeline.exec();
    },
    getCommentsFromCache: (postId) => {
      return redis.zrange(postId, 0, -1);
    },
    setExpiration: (postId) => {
      return redis.expire(postId, 60);
    },
    clearCachedCommentsForPost: (postId) => {
      return redis.del(postId);
    },
  };
  return commentsRepository;
};
