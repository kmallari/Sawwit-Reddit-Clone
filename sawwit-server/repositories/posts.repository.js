module.exports = (db) => {
  const postsRepository = {
    createTextPost: (
      id,
      userId,
      username,
      title,
      body,
      subredditName,
      subredditIcon,
      createdAt
    ) => {
      return db.raw("CALL CreateTextPost(?, ?, ?, ?, ?, ?, ?, ?)", [
        id,
        userId,
        username,
        title,
        body,
        subredditName,
        subredditIcon,
        createdAt,
      ]);
    },
    createImagePost: (
      id,
      userId,
      username,
      title,
      imagePath,
      subredditName,
      subredditIcon,
      createdAt
    ) => {
      return db.raw("CALL CreateImagePost(?, ?, ?, ?, ?, ?, ?, ?)", [
        id,
        userId,
        username,
        title,
        imagePath,
        subredditName,
        subredditIcon,
        createdAt,
      ]);
    },
    createURLPost: (
      id,
      userId,
      username,
      title,
      url,
      linkPreview,
      subredditName,
      subredditIcon,
      createdAt
    ) => {
      return db.raw("CALL CreateURLPost(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        id,
        userId,
        username,
        title,
        url,
        linkPreview,
        subredditName,
        subredditIcon,
        createdAt,
      ]);
    },
    checkIfPostExists: (postId) => {
      return db.raw("CALL CheckIfPostExists(?)", [postId]);
    },
    getOnePost: (postId, userId) => {
      return db.raw("CALL GetOnePost(?, ?)", [postId, userId]);
    },
    getAllPosts: () => {
      return db.raw("CALL GetAllPosts()");
    },
    getAllPostsFromSubreddit: (subredditName) => {
      return db.raw("CALL GetPostsFromSubreddit(?)", [subredditName]);
    },
    getUserPosts: (userId) => {
      return db.raw("CALL GetUserPosts(?)", [userId]);
    },
    getAllPostsUsingPagination: (start, items, userId) => {
      return db.raw("CALL GetAllPostsUsingPagination(?, ?, ?)", [
        start,
        items,
        userId,
      ]);
    },
    getSubredditPostsUsingPagination: (
      start,
      items,
      subredditName,
      loggedInUser
    ) => {
      return db.raw("CALL GetSubredditPostsUsingPagination(?, ?, ?, ?)", [
        start,
        items,
        subredditName,
        loggedInUser,
      ]);
    },
    getUserPostsUsingPagination: (start, items, userId, loggedInUser) => {
      return db.raw("CALL GetUserPostsUsingPagination(?, ?, ?, ?)", [
        start,
        items,
        userId,
        loggedInUser,
      ]);
    },
    doesPostExist: (postId) => {
      return db.raw("CALL DoesPostExist(?)", [postId]);
    },
    deletePost: (postId) => {
      return db.raw("CALL DeletePost(?)", [postId]);
    },
    updatePostBody: (postId, body) => {
      return db.raw("CALL UpdatePostBody(?, ?)", [postId, body]);
    },
    checkIfSubredditExists: (name) => {
      return db.raw("CALL CheckIfSubredditExists(?)", [name]);
    },
    checkIfUserExists: (id) => {
      return db.raw("CALL CheckIfIDExists(?)", [id]);
    },
    checkIfUserHasVoted: (userId, postId) => {
      return db.raw("CALL CheckIfUserVotedPost(?, ?)", [userId, postId]);
    },
    votePost: (userId, postId, vote) => {
      return db.raw("CALL CreatePostVote(?, ?, ?)", [userId, postId, vote]);
    },
    deleteVote: (userId, postId) => {
      return db.raw("CALL DeletePostVote(?, ?)", [userId, postId]);
    },
    decrementPostUpvote: (postId) => {
      return db.raw("CALL DecrementPostUpvote(?)", [postId]);
    },
    decrementPostDownvote: (postId) => {
      return db.raw("CALL DecrementPostDownvote(?)", [postId]);
    },
  };
  return postsRepository;
};
