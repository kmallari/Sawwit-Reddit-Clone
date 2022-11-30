module.exports = (db) => {
  const votesRepository = {
    checkIfUserVotedPost: (userId, postId) => {
      return db.raw("CALL CheckIfUserVotedPost(?, ?)", [userId, postId]);
    },
    checkIfUserVotedComment: (userId, commentId) => {
      return db.raw("CALL CheckIfUserVotedComment(?, ?)", [
        userId,
        commentId,
      ]);
    },
    createPostVote: (userId, postId, vote) => {
      return db.raw("CALL CreatePostVote(?, ?, ?)", [userId, postId, vote]);
    },
    createCommentVote: (userId, commentId, vote) => {
      return db.raw("CALL CreateCommentVote(?, ?, ?)", [
        userId,
        commentId,
        vote,
      ]);
    },
  };
  return votesRepository;
};
