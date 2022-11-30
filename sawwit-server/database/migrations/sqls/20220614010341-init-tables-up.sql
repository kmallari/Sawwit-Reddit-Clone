-- TO DO: ADD SUBSTRACTING IN DELETES
-- CREATING THE TABLES
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` VARCHAR(21) NOT NULL PRIMARY KEY,
  `username` VARCHAR(20) NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `profilePicture` VARCHAR(255) NOT NULL,
  `createdAt` BIGINT NOT NULL
);

DROP TABLE IF EXISTS `posts`;

CREATE TABLE `posts` (
  `id` VARCHAR(21) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(21) NOT NULL,
  `username` VARCHAR(20) NOT NULL,
  `title` VARCHAR(300) NOT NULL,
  `body` VARCHAR(40000),
  `image` VARCHAR(255),
  `url` VARCHAR(255),
  `linkPreview` VARCHAR(255),
  `subreddit` VARCHAR(20) NOT NULL,
  `subredditIcon` VARCHAR(255) NOT NULL,
  `commentsCount` INT NOT NULL,
  `upvotes` INT NOT NULL,
  `downvotes` INT NOT NULL,
  `type` TINYINT NOT NULL,
  `createdAt` BIGINT NOT NULL
);

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` VARCHAR(21) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(21) NOT NULL,
  `username` VARCHAR(20) NOT NULL,
  `userProfilePicture` VARCHAR (255) NOT NULL,
  `postId` VARCHAR(21) NOT NULL,
  `parentId` VARCHAR(21) NOT NULL,
  `body` VARCHAR(10000) NOT NULL,
  `createdAt` BIGINT NOT NULL,
  `level` INT NOT NULL,
  `childrenCount` INT NOT NULL,
  `upvotes` INT NOT NULL,
  `downvotes` INT NOT NULL
);

DROP TABLE IF EXISTS `subreddits`;

CREATE TABLE `subreddits` (
  `name` VARCHAR(20) NOT NULL PRIMARY KEY,
  `description` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(255) NOT NULL,
  `postCount` INT NOT NULL,
  `createdAt` BIGINT NOT NULL
);

DROP TABLE IF EXISTS `postVotes`;

CREATE TABLE `postVotes` (
  `userId` VARCHAR(21) NOT NULL,
  `postId` VARCHAR(21) NOT NULL,
  `vote` TINYINT NOT NULL
);

DROP TABLE IF EXISTS `commentVotes`;

CREATE TABLE `commentVotes` (
  `userId` VARCHAR(21) NOT NULL,
  `commentId` VARCHAR(21) NOT NULL,
  `vote` TINYINT NOT NULL
);

DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `id` VARCHAR(21) NOT NULL PRIMARY KEY,
  `name` VARCHAR(32) NOT NULL,
  `numberOfParticipants` INT NOT NULL,
  `roomImage` VARCHAR(255) NOT NULL,
  `updatedAt` BIGINT NOT NULL,
  `createdAt` BIGINT NOT NULL
);

DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
  `id` VARCHAR(21) NOT NULL PRIMARY KEY,
  `senderId` VARCHAR(21) NOT NULL,
  `senderUsername` VARCHAR(20) NOT NULL,
  `senderProfilePicture` VARCHAR(255) NOT NULL,
  `roomId` VARCHAR(21) NOT NULL,
  `message` VARCHAR(10000) NOT NULL,
  `createdAt` BIGINT NOT NULL
);

DROP TABLE IF EXISTS `roomParticipants`;

CREATE TABLE `roomParticipants` (
  `roomId` VARCHAR(21) NOT NULL,
  `userId` VARCHAR(21) NOT NULL,
  `username` VARCHAR(20) NOT NULL,
  `userProfilePicture` VARCHAR(255) NOT NULL,
  `createdAt` BIGINT NOT NULL
);

DROP TABLE IF EXISTS `roomInvitations`;

CREATE TABLE `roomInvitations` (
  `userId` VARCHAR(21) NOT NULL,
  `invitedById` VARCHAR(21) NOT NULL,
  `invitedByUsername` VARCHAR(20) NOT NULL,
  `roomId` VARCHAR(21) NOT NULL,
  `roomName` VARCHAR(32) NOT NULL,
  `roomImage` VARCHAR(255) NOT NULL,
  `createdAt` BIGINT NOT NULL
);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- CREATING INDEXES FOR USERS
ALTER TABLE
  `users`
ADD
  UNIQUE INDEX `username_index` (`username`);

ALTER TABLE
  `users`
ADD
  UNIQUE INDEX `email_index` (`email`);

-- CREATING INDEXES FOR SUBREDDITS;
ALTER TABLE
  `subreddits`
ADD
  INDEX `createdAt_index` (`createdAt` DESC);

-- CREATING INDEXES FOR POSTS
ALTER TABLE
  `posts`
ADD
  INDEX `userId_index` (`userId`);

ALTER TABLE
  `posts`
ADD
  INDEX `subreddit_index` (`subreddit`);

ALTER TABLE
  `posts`
ADD
  INDEX `createdAt_index` (`createdAt` DESC);

-- CREATING INDEXES FOR COMMENTS
ALTER TABLE
  `comments`
ADD
  INDEX `postId_index` (`postId`);

ALTER TABLE
  `comments`
ADD
  INDEX `parentId_index` (`parentId`);

ALTER TABLE
  `comments`
ADD
  INDEX `createdAt_index` (`createdAt` DESC);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- CREATING THE STORED PROCEDURES FOR USERS
DROP PROCEDURE IF EXISTS GetAllUsers;

CREATE PROCEDURE GetAllUsers () BEGIN
SELECT
  *
FROM
  users;

END;

DROP PROCEDURE IF EXISTS RegisterUser;

CREATE PROCEDURE RegisterUser (
  IN p_ID varchar(21),
  IN p_username varchar(20),
  IN p_email varchar(320),
  IN p_password varchar(255),
  IN p_profilepicture varchar(255),
  IN p_createdAt BIGINT
) BEGIN
INSERT INTO
  users (
    id,
    username,
    email,
    PASSWORD,
    profilePicture,
    createdAt
  )
VALUES
  (
    p_ID,
    p_username,
    p_email,
    p_password,
    p_profilepicture,
    p_createdAt
  );

END;

DROP PROCEDURE IF EXISTS CheckIfUsernameExists;

CREATE PROCEDURE CheckIfUsernameExists(p_username VARCHAR(20)) BEGIN
SELECT
  COUNT(username)
FROM
  users
WHERE
  username = p_username;

END;

DROP PROCEDURE IF EXISTS CheckIfEmailExists;

CREATE PROCEDURE CheckIfEmailExists(p_email VARCHAR(320)) BEGIN
SELECT
  COUNT(email)
FROM
  users
WHERE
  email = p_email;

END;

DROP PROCEDURE IF EXISTS CheckIfIDExists;

CREATE PROCEDURE CheckIfIDExists(p_ID VARCHAR(21)) BEGIN
SELECT
  id,
  username,
  profilePicture
FROM
  users
WHERE
  id = p_ID;

END;

DROP PROCEDURE IF EXISTS LoginUser;

CREATE PROCEDURE LoginUser(
  p_email VARCHAR(320),
  p_username VARCHAR(20)
) BEGIN
SELECT
  id,
  username,
  email,
  profilePicture,
  PASSWORD,
  createdAt
FROM
  users
WHERE
  email = p_email
  OR username = p_username;

END;

DROP PROCEDURE IF EXISTS GetUserInformation;

CREATE PROCEDURE GetUserInformation(p_id VARCHAR(21)) BEGIN
SELECT
  *
FROM
  users
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS SearchUserByUsername;

CREATE PROCEDURE SearchUserByUsername(p_username VARCHAR(20)) BEGIN
SELECT
  *
FROM
  users
WHERE
  username LIKE p_username;

END;

DROP PROCEDURE IF EXISTS UpdateUsername;

CREATE PROCEDURE UpdateUsername(p_id VARCHAR(21), p_username VARCHAR(20)) BEGIN
UPDATE
  users
SET
  username = p_username
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS UpdateEmail;

CREATE PROCEDURE UpdateEmail(p_id VARCHAR(21), p_email VARCHAR(320)) BEGIN
UPDATE
  users
SET
  email = p_email
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS UpdateProfilePicture;

CREATE PROCEDURE UpdateProfilePicture(p_id VARCHAR(21), p_profilepicture VARCHAR(255)) BEGIN
UPDATE
  users
SET
  profilePicture = p_profilepicture
WHERE
  id = p_id;

UPDATE
  comments
SET
  userProfilePicture = p_profilepicture
WHERE
  userId = p_id;

END;

DROP PROCEDURE IF EXISTS UpdatePassword;

CREATE PROCEDURE UpdatePassword(p_id VARCHAR(21), p_password VARCHAR(255)) BEGIN
UPDATE
  users
SET
  PASSWORD = p_password
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS DeleteUser;

CREATE PROCEDURE DeleteUser(p_id VARCHAR(21)) BEGIN
DELETE FROM
  users
WHERE
  id = p_id;

END;

-- CREATING STORED PROCEDURES FOR POSTS
DROP PROCEDURE IF EXISTS GetAllPosts;

CREATE PROCEDURE GetAllPosts () BEGIN
SELECT
  *
FROM
  posts
ORDER BY
  createdAt DESC;

END;

DROP PROCEDURE IF EXISTS GetPostsFromSubreddit;

CREATE PROCEDURE GetPostsFromSubreddit(p_name VARCHAR(20)) BEGIN
SELECT
  *
FROM
  posts
WHERE
  subreddit = p_name
ORDER BY
  createdAt DESC;

END;

DROP PROCEDURE IF EXISTS CheckIfPostExists;

CREATE PROCEDURE CheckIfPostExists(p_postId VARCHAR(21)) BEGIN
SELECT
  COUNT(id)
FROM
  posts
WHERE
  posts.id = p_postId;

END;

DROP PROCEDURE IF EXISTS GetAllPostsUsingPagination;

CREATE PROCEDURE GetAllPostsUsingPagination(
  p_start INT,
  p_items INT,
  p_loggedInUserId VARCHAR(21)
) BEGIN
SELECT
  posts.id,
  posts.userId,
  posts.username,
  posts.title,
  posts.body,
  posts.subreddit,
  posts.subredditIcon,
  posts.commentsCount,
  posts.upvotes,
  posts.downvotes,
  posts.createdAt,
  posts.image,
  posts.url,
  posts.linkPreview,
  posts.type,
  postVotes.vote AS myVote
FROM
  posts
  LEFT JOIN postVotes ON posts.id = postVotes.postId
  AND postVotes.userId = p_loggedInUserId
ORDER BY
  createdAt DESC
LIMIT
  p_start, p_items;

END;

DROP PROCEDURE IF EXISTS GetSubredditPostsUsingPagination;

CREATE PROCEDURE GetSubredditPostsUsingPagination(
  p_start INT,
  p_items INT,
  p_name VARCHAR(20),
  p_loggedInUserId VARCHAR(21)
) BEGIN
SELECT
  posts.id,
  posts.userId,
  posts.username,
  posts.title,
  posts.body,
  posts.subreddit,
  posts.subredditIcon,
  posts.commentsCount,
  posts.upvotes,
  posts.downvotes,
  posts.createdAt,
  posts.image,
  posts.url,
  posts.linkPreview,
  posts.type,
  postVotes.vote AS myVote
FROM
  posts
  LEFT JOIN postVotes ON posts.id = postVotes.postId
  AND postVotes.userId = p_loggedInUserId
WHERE
  subreddit = p_name
ORDER BY
  createdAt DESC
LIMIT
  p_start, p_items;

END;

DROP PROCEDURE IF EXISTS GetUserPostsUsingPagination;

CREATE PROCEDURE GetUserPostsUsingPagination(
  p_start INT,
  p_items INT,
  p_userId VARCHAR(21),
  p_loggedInUserId VARCHAR(21)
) BEGIN
SELECT
  posts.id,
  posts.userId,
  posts.username,
  posts.title,
  posts.body,
  posts.subreddit,
  posts.subredditIcon,
  posts.commentsCount,
  posts.upvotes,
  posts.downvotes,
  posts.createdAt,
  posts.image,
  posts.url,
  posts.linkPreview,
  posts.type,
  postVotes.vote AS myVote
FROM
  posts
  LEFT JOIN postVotes ON posts.id = postVotes.postId
  AND postVotes.userId = p_loggedInUserId
WHERE
  posts.userId = p_userId
ORDER BY
  createdAt DESC
LIMIT
  p_start, p_items;

END;

DROP PROCEDURE IF EXISTS CreateTextPost;

CREATE PROCEDURE CreateTextPost(
  IN p_ID VARCHAR(21),
  IN p_userId VARCHAR(21),
  IN p_username VARCHAR(20),
  IN p_title VARCHAR(300),
  IN p_body VARCHAR(40000),
  IN p_subreddit VARCHAR(20),
  IN p_subredditIcon VARCHAR(255),
  IN p_createdAt BIGINT
) BEGIN
INSERT INTO
  posts (
    id,
    userId,
    username,
    title,
    body,
    subreddit,
    subredditIcon,
    createdAt,
    commentsCount,
    upvotes,
    downvotes,
    TYPE
  )
VALUES
  (
    p_ID,
    p_userId,
    p_username,
    p_title,
    p_body,
    p_subreddit,
    p_subredditIcon,
    p_createdAt,
    0,
    0,
    0,
    1
  );

UPDATE
  subreddits
SET
  postCount = postCount + 1
WHERE
  name = p_subreddit;

END;

DROP PROCEDURE IF EXISTS CreateImagePost;

CREATE PROCEDURE CreateImagePost(
  IN p_ID VARCHAR(21),
  IN p_userId VARCHAR(21),
  IN p_username VARCHAR(20),
  IN p_title VARCHAR(300),
  IN p_imageDirectory VARCHAR(255),
  IN p_subreddit VARCHAR(20),
  IN p_subredditIcon VARCHAR(255),
  IN p_createdAt BIGINT
) BEGIN
INSERT INTO
  posts (
    id,
    userId,
    username,
    title,
    image,
    subreddit,
    subredditIcon,
    createdAt,
    commentsCount,
    upvotes,
    downvotes,
    TYPE
  )
VALUES
  (
    p_ID,
    p_userId,
    p_username,
    p_title,
    p_imageDirectory,
    p_subreddit,
    p_subredditIcon,
    p_createdAt,
    0,
    0,
    0,
    2
  );

UPDATE
  subreddits
SET
  postCount = postCount + 1
WHERE
  name = p_subreddit;

END;

DROP PROCEDURE IF EXISTS CreateURLPost;

CREATE PROCEDURE CreateURLPost(
  IN p_ID VARCHAR(21),
  IN p_userId VARCHAR(21),
  IN p_username VARCHAR(20),
  IN p_title VARCHAR(300),
  IN p_url VARCHAR(255),
  IN p_linkPreview VARCHAR(255),
  IN p_subreddit VARCHAR(20),
  IN p_subredditIcon VARCHAR(255),
  IN p_createdAt BIGINT
) BEGIN
INSERT INTO
  posts (
    id,
    userId,
    username,
    title,
    url,
    linkPreview,
    subreddit,
    subredditIcon,
    createdAt,
    commentsCount,
    upvotes,
    downvotes,
    TYPE
  )
VALUES
  (
    p_ID,
    p_userId,
    p_username,
    p_title,
    p_url,
    p_linkPreview,
    p_subreddit,
    p_subredditIcon,
    p_createdAt,
    0,
    0,
    0,
    3
  );

UPDATE
  subreddits
SET
  postCount = postCount + 1
WHERE
  name = p_subreddit;

END;

DROP PROCEDURE IF EXISTS UpdatePostBody;

CREATE PROCEDURE UpdatePostBody(p_id VARCHAR(21), p_body VARCHAR(40000)) BEGIN
UPDATE
  posts
SET
  body = p_body
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS GetOnePost;

CREATE PROCEDURE GetOnePost(p_id VARCHAR(21), p_userID VARCHAR(21)) BEGIN
SELECT
  posts.id,
  posts.userId,
  posts.username,
  posts.title,
  posts.body,
  posts.subreddit,
  posts.subredditIcon,
  posts.commentsCount,
  posts.upvotes,
  posts.downvotes,
  posts.createdAt,
  posts.image,
  posts.url,
  posts.linkPreview,
  posts.type,
  postVotes.vote AS myVote
FROM
  posts
  LEFT JOIN postVotes ON posts.id = postVotes.postId
  AND postVotes.userId = p_userId
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS GetUserPosts;

CREATE PROCEDURE GetUserPosts(p_userid VARCHAR(21)) BEGIN
SELECT
  *
FROM
  posts
WHERE
  userId = p_userid
ORDER BY
  createdAt DESC;

END;

DROP PROCEDURE IF EXISTS DoesPostExist;

CREATE PROCEDURE DoesPostExist(p_id VARCHAR(21)) BEGIN
SELECT
  COUNT(id)
FROM
  posts
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS DeletePost;

CREATE PROCEDURE DeletePost(p_id VARCHAR(21)) BEGIN
DELETE FROM
  posts
WHERE
  id = p_id;

UPDATE
  subreddits
SET
  postCount = postCount - 1
WHERE
  name = (
    SELECT
      subreddit
    FROM
      posts
    WHERE
      id = p_id
  );

END;

-- STORED PROCEDURES FOR SUBREDDITS
DROP PROCEDURE IF EXISTS GetAllSubreddits;

CREATE PROCEDURE GetAllSubreddits () BEGIN
SELECT
  *
FROM
  subreddits;

END;

DROP PROCEDURE IF EXISTS GetSubredditInfo;

CREATE PROCEDURE GetSubredditInfo (p_name VARCHAR(21)) BEGIN
SELECT
  *
FROM
  subreddits
WHERE
  name = p_name;

END;

DROP PROCEDURE IF EXISTS CheckIfSubredditExists;

CREATE PROCEDURE CheckIfSubredditExists(p_subreddit VARCHAR(20)) BEGIN
SELECT
  name,
  icon,
  postCount
FROM
  subreddits
WHERE
  name = p_subreddit;

END;

DROP PROCEDURE IF EXISTS CreateSubreddit;

CREATE PROCEDURE CreateSubreddit (
  p_name VARCHAR(20),
  p_description VARCHAR(255),
  p_icon VARCHAR(255),
  p_createdAt BIGINT
) BEGIN
INSERT INTO
  subreddits (
    name,
    description,
    icon,
    createdAt,
    postCount
  )
VALUES
  (
    p_name,
    p_description,
    p_icon,
    p_createdAt,
    0
  );

END;

DROP PROCEDURE IF EXISTS UpdateSubredditDescription;

CREATE PROCEDURE UpdateSubredditDescription (
  p_name VARCHAR(21),
  p_description VARCHAR(255)
) BEGIN
UPDATE
  subreddits
SET
  description = p_description
WHERE
  name = p_name;

END;

DROP PROCEDURE IF EXISTS UpdateSubredditIcon;

CREATE PROCEDURE UpdateSubredditIcon (p_name VARCHAR(21), p_icon VARCHAR(255)) BEGIN
UPDATE
  subreddits
SET
  icon = p_icon
WHERE
  name = p_name;

UPDATE
  posts
SET
  subredditIcon = p_icon
WHERE
  subreddit = p_name;

END;

DROP PROCEDURE IF EXISTS SearchSubreddit;

CREATE PROCEDURE SearchSubreddit (p_name VARCHAR(20)) BEGIN
SELECT
  *
FROM
  subreddits
WHERE
  name LIKE p_name;

END;

DROP PROCEDURE IF EXISTS UpdateSubredditIcon;

CREATE PROCEDURE UpdateSubredditIcon (p_name VARCHAR(21), p_icon VARCHAR(255)) BEGIN
UPDATE
  subreddits
SET
  icon = p_icon
WHERE
  name = p_name;

END;

DROP PROCEDURE IF EXISTS GetRecentlyCreatedSubreddits;

CREATE PROCEDURE GetRecentlyCreatedSubreddits (p_count SMALLINT) BEGIN
SELECT
  *
FROM
  subreddits
ORDER BY
  createdAt DESC
LIMIT
  p_count;

END;

-- STORED PROCEDURES FOR COMMENTS
DROP PROCEDURE IF EXISTS GetAllComments;

CREATE PROCEDURE GetAllComments () BEGIN
SELECT
  *
FROM
  comments
ORDER BY
  createdAt DESC;

END;

DROP PROCEDURE IF EXISTS CreateComment;

CREATE PROCEDURE CreateComment(
  IN p_id VARCHAR(21),
  IN p_userid VARCHAR(21),
  IN p_username VARCHAR(20),
  IN p_userProfilePicture VARCHAR(255),
  IN p_postid VARCHAR(21),
  IN p_parentid VARCHAR(21),
  IN p_body VARCHAR(10000),
  IN p_createdAt BIGINT,
  IN p_parentLevel INT
) BEGIN
INSERT INTO
  comments (
    id,
    userId,
    username,
    userProfilePicture,
    postId,
    parentId,
    body,
    createdAt,
    LEVEL,
    childrenCount,
    upvotes,
    downvotes
  )
VALUES
  (
    p_id,
    p_userid,
    p_username,
    p_userProfilePicture,
    p_postid,
    p_parentid,
    p_body,
    p_createdAt,
    p_parentLevel + 1,
    0,
    0,
    0
  );

UPDATE
  posts
SET
  commentsCount = commentsCount + 1
WHERE
  id = p_postid;

UPDATE
  comments
SET
  childrenCount = childrenCount + 1
WHERE
  id = p_parentid;

END;

DROP PROCEDURE IF EXISTS GetPostComments;

CREATE PROCEDURE GetPostComments(
  p_postid VARCHAR(21),
  p_loggedInUserId VARCHAR(21)
) BEGIN
SELECT
  comments.id,
  comments.userId,
  comments.username,
  comments.userProfilePicture,
  comments.postId,
  comments.parentId,
  comments.body,
  comments.createdAt,
  comments.level,
  comments.childrenCount,
  comments.upvotes,
  comments.downvotes,
  commentVotes.vote AS myVote
FROM
  comments
  LEFT JOIN commentVotes ON comments.id = commentVotes.commentId
  AND commentVotes.userId = p_loggedInUserId
WHERE
  postId = p_postid
ORDER BY
  createdAt DESC;

END;

DROP PROCEDURE IF EXISTS DeleteComment;

CREATE PROCEDURE DeleteComment(p_id VARCHAR(21)) BEGIN
DELETE FROM
  comments
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS GetOneComment;

CREATE PROCEDURE GetOneComment(p_id VARCHAR(21)) BEGIN
SELECT
  *
FROM
  comments
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS GetNextComments;

CREATE PROCEDURE GetNextComments (
  p_parentid VARCHAR(21),
  p_loggedInUserId VARCHAR(21)
) BEGIN
SELECT
  comments.id,
  comments.userId,
  comments.username,
  comments.userProfilePicture,
  comments.postId,
  comments.parentId,
  comments.body,
  comments.createdAt,
  comments.level,
  comments.childrenCount,
  comments.upvotes,
  comments.downvotes,
  commentVotes.vote AS myVote
FROM
  comments
  LEFT JOIN commentVotes ON comments.id = commentVotes.commentId
  AND commentVotes.userId = p_loggedInUserId
WHERE
  parentId = p_parentid
ORDER BY
  createdAt DESC;

END;

DROP PROCEDURE IF EXISTS ChangeComment;

CREATE PROCEDURE ChangeComment(
  IN p_id VARCHAR(21),
  IN p_body VARCHAR(10000)
) BEGIN
UPDATE
  comments
SET
  body = p_body
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS CheckIfCommentExists;

CREATE PROCEDURE CheckIfCommentExists(p_id VARCHAR(21)) BEGIN
SELECT
  COUNT(id)
FROM
  comments
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS CheckIfUserVotedPost;

CREATE PROCEDURE CheckIfUserVotedPost(p_userId VARCHAR(21), p_postId VARCHAR(21)) BEGIN
SELECT
  vote
FROM
  postVotes
WHERE
  userId = p_userId
  AND postId = p_postId;

END;

DROP PROCEDURE IF EXISTS CreatePostVote;

CREATE PROCEDURE CreatePostVote (
  p_userId VARCHAR(21),
  p_postId VARCHAR(21),
  p_vote TINYINT
) BEGIN
INSERT INTO
  postVotes (userId, postId, vote)
VALUES
  (p_userId, p_postId, p_vote);

UPDATE
  posts
SET
  upvotes = upvotes + p_vote
WHERE
  id = p_postId
  AND p_vote = 1;

UPDATE
  posts
SET
  downvotes = downvotes - p_vote
WHERE
  id = p_postId
  AND p_vote = -1;

END;

DROP PROCEDURE IF EXISTS DecrementPostUpvote;

CREATE PROCEDURE DecrementPostUpvote (p_postId VARCHAR(21)) BEGIN
UPDATE
  posts
SET
  upvotes = upvotes - 1
WHERE
  id = p_postId;

END;

DROP PROCEDURE IF EXISTS DecrementPostDownvote;

CREATE PROCEDURE DecrementPostDownvote (p_postId VARCHAR(21)) BEGIN
UPDATE
  posts
SET
  downvotes = downvotes - 1
WHERE
  id = p_postId;

END;

DROP PROCEDURE IF EXISTS DeletePostVote;

CREATE PROCEDURE DeletePostVote (
  p_userId VARCHAR(21),
  p_postId VARCHAR(21)
) BEGIN
DELETE FROM
  postVotes
WHERE
  userId = p_userId
  AND postId = p_postId;

END;

-- STORED PROCEDURES FOR COMMENT VOTES
DROP PROCEDURE IF EXISTS CheckIfUserVotedComment;

CREATE PROCEDURE CheckIfUserVotedComment (p_userId VARCHAR(21), p_commentId VARCHAR(21)) BEGIN
SELECT
  vote
FROM
  commentVotes
WHERE
  userId = p_userId
  AND commentId = p_commentId;

END;

DROP PROCEDURE IF EXISTS CreateCommentVote;

CREATE PROCEDURE CreateCommentVote (
  p_userId VARCHAR(21),
  p_commentId VARCHAR(21),
  p_vote INT
) BEGIN
INSERT INTO
  commentVotes (userId, commentId, vote)
VALUES
  (
    p_userId,
    p_commentId,
    p_vote
  );

UPDATE
  comments
SET
  upvotes = upvotes + p_vote
WHERE
  id = p_commentId
  AND p_vote = 1;

UPDATE
  comments
SET
  downvotes = downvotes - p_vote
WHERE
  id = p_commentId
  AND p_vote = -1;

END;

DROP PROCEDURE IF EXISTS DecrementCommentUpvote;

CREATE PROCEDURE DecrementCommentUpvote (p_commentId VARCHAR(21)) BEGIN
UPDATE
  comments
SET
  upvotes = upvotes - 1
WHERE
  id = p_commentId;

END;

DROP PROCEDURE IF EXISTS DecrementCommentDownvote;

CREATE PROCEDURE DecrementCommentDownvote (p_commentId VARCHAR(21)) BEGIN
UPDATE
  comments
SET
  downvotes = downvotes - 1
WHERE
  id = p_commentId;

END;

DROP PROCEDURE IF EXISTS DeleteCommentVote;

CREATE PROCEDURE DeleteCommentVote (
  p_userId VARCHAR(21),
  p_commentId VARCHAR(21)
) BEGIN
DELETE FROM
  commentVotes
WHERE
  userId = p_userId
  AND commentId = p_commentId;

END;

-- STORED PROCEDURES FOR SUBSCRIPTIONS
DROP PROCEDURE IF EXISTS GetUserSubscriptions;

CREATE PROCEDURE GetUserSubscriptions(p_userId VARCHAR(21)) BEGIN
SELECT
  *
FROM
  subscriptions
WHERE
  userId = p_userId
ORDER BY
  createdAt DESC;

END;

-- MAKE SURE TO CHANGE SUBREDDIT ID
DROP PROCEDURE IF EXISTS Subscribe;

CREATE PROCEDURE Subscribe (
  p_userId VARCHAR(21),
  p_subredditId VARCHAR(21),
  p_createdAt BIGINT
) BEGIN
INSERT INTO
  subscriptions (
    userId,
    subredditId,
    createdAt
  )
VALUES
  (
    p_userId,
    p_subredditId,
    p_createdAt
  );

END;

DROP PROCEDURE IF EXISTS Unscubscribe;

CREATE PROCEDURE Unscubscribe (
  p_userId VARCHAR(21),
  p_subredditId VARCHAR(21)
) BEGIN
DELETE FROM
  subscriptions
WHERE
  userId = p_userId
  AND subredditId = p_subredditId;

END;

-- STORE PROCEDURE FOR ROOMS
DROP PROCEDURE IF EXISTS CreateRoom;

CREATE PROCEDURE CreateRoom (
  p_id VARCHAR(21),
  p_name VARCHAR(32),
  p_roomImage VARCHAR(255),
  p_createdAt BIGINT
) BEGIN
INSERT INTO
  rooms(
    id,
    name,
    numberOfParticipants,
    roomImage,
    updatedAt,
    createdAt
  )
VALUES
  (
    p_id,
    p_name,
    0,
    p_roomImage,
    p_createdAt,
    p_createdAt
  );

END;

DROP PROCEDURE IF EXISTS CreateMessage;

CREATE PROCEDURE CreateMessage (
  p_id VARCHAR(21),
  p_senderId VARCHAR(21),
  p_senderUsername VARCHAR(32),
  p_senderProfilePicture VARCHAR(255),
  p_roomId VARCHAR(21),
  p_message VARCHAR(10000),
  p_updatedAt BIGINT,
  p_createdAt BIGINT
) BEGIN
INSERT INTO
  messages(
    id,
    senderId,
    senderUsername,
    senderProfilePicture,
    roomId,
    message,
    createdAt
  )
VALUES
  (
    p_id,
    p_senderId,
    p_senderUsername,
    p_senderProfilePicture,
    p_roomId,
    p_message,
    p_createdAt
  );

UPDATE
  rooms
SET
  updatedAt = p_updatedAt
WHERE
  id = p_roomId;

SELECT
  *
FROM
  messages
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS GetRoomInfo;

CREATE PROCEDURE GetRoomInfo (p_roomId VARCHAR(21)) BEGIN
SELECT
  *
FROM
  rooms
WHERE
  id = p_roomId;

END;

DROP PROCEDURE IF EXISTS GetRoomMessages;

CREATE PROCEDURE GetRoomMessages (
  p_roomId VARCHAR(21),
  p_start INT,
  p_items INT
) BEGIN
SELECT
  *
FROM
  messages
WHERE
  roomId = p_roomId
ORDER BY
  createdAt DESC
LIMIT
  p_start, p_items;

END;

DROP PROCEDURE IF EXISTS AddToRoom;

CREATE PROCEDURE AddToRoom (
  p_id VARCHAR(21),
  p_userId VARCHAR(21),
  p_username VARCHAR(20),
  p_userProfilePicture VARCHAR(255),
  p_createdAt BIGINT
) BEGIN
INSERT INTO
  roomParticipants(
    roomId,
    userId,
    username,
    userProfilePicture,
    createdAt
  )
VALUES
  (
    p_id,
    p_userId,
    p_username,
    p_userProfilePicture,
    p_createdAt
  );

UPDATE
  rooms
SET
  numberOfParticipants = numberOfParticipants + 1
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS GetRoomParticipants;

CREATE PROCEDURE GetRoomParticipants (p_roomId VARCHAR(21)) BEGIN
SELECT
  *
FROM
  roomParticipants
WHERE
  roomId = p_roomId
ORDER BY
  createdAt DESC;

END;

DROP PROCEDURE IF EXISTS CheckIfUserIsInRoom;

CREATE PROCEDURE CheckIfUserIsInRoom (p_userId VARCHAR(21), p_roomId VARCHAR(21)) BEGIN
SELECT
  1
FROM
  roomParticipants
WHERE
  userId = p_userId
  AND roomId = p_roomId;

END;

DROP PROCEDURE IF EXISTS GetRoomsUserIsIn;

CREATE PROCEDURE GetRoomsUserIsIn (p_userId VARCHAR(21), p_start INT, p_items INT) BEGIN
SELECT
  *
FROM
  rooms
WHERE
  id IN (
    SELECT
      roomId
    FROM
      roomParticipants
    WHERE
      userId = p_userId
  )
ORDER BY
  updatedAt DESC
LIMIT
  p_start, p_items;

END;

DROP PROCEDURE IF EXISTS InviteUserToRoom;

CREATE PROCEDURE InviteUserToRoom (
  p_userId VARCHAR(21),
  p_invitedById VARCHAR(21),
  p_invitedByUsername VARCHAR(20),
  p_roomId VARCHAR(21),
  p_roomName VARCHAR(32),
  p_roomImage VARCHAR(255),
  p_createdAt BIGINT
) BEGIN
INSERT INTO
  roomInvitations(
    userId,
    invitedById,
    invitedByUsername,
    roomId,
    roomName,
    roomImage,
    createdAt
  )
VALUES
  (
    p_userId,
    p_invitedById,
    p_invitedByUsername,
    p_roomId,
    p_roomName,
    p_roomImage,
    p_createdAt
  );

END;

DROP PROCEDURE IF EXISTS GetUserInvitations;

CREATE PROCEDURE GetUserInvitations (
  p_userId VARCHAR(21),
  p_start INT,
  p_items INT
) BEGIN
SELECT
  *
FROM
  roomInvitations
WHERE
  userId = p_userId
ORDER BY
  createdAt DESC
LIMIT
  p_start, p_items;

END;

DROP PROCEDURE IF EXISTS DeleteInvitation;

CREATE PROCEDURE DeleteInvitation (
  p_userId VARCHAR(21),
  p_roomId VARCHAR(21)
) BEGIN
DELETE FROM
  roomInvitations
WHERE
  userId = p_userId
  AND roomId = p_roomId;

END;

DROP PROCEDURE IF EXISTS CheckIfUserHasBeenInvited;

CREATE PROCEDURE CheckIfUserHasBeenInvited (
  p_userId VARCHAR(21),
  p_roomId VARCHAR(21)
) BEGIN
SELECT
  1
FROM
  roomInvitations
WHERE
  userId = p_userId
  AND roomId = p_roomId;

END;

DROP PROCEDURE IF EXISTS DeleteRoom;

CREATE PROCEDURE DeleteRoom(p_id VARCHAR(21)) BEGIN
DELETE FROM
  rooms
WHERE
  id = p_id;

DELETE FROM
  roomParticipants
WHERE
  roomId = p_id;

DELETE FROM
  roomInvitations
WHERE
  roomId = p_id;

DELETE FROM
  messages
WHERE
  roomId = p_id;

END;

DROP PROCEDURE IF EXISTS ChangeRoomName;

CREATE PROCEDURE ChangeRoomName (
  p_id VARCHAR(21),
  p_name VARCHAR(32),
  p_updatedAt BIGINT
) BEGIN
UPDATE
  rooms
SET
  name = p_name,
  updatedAt = p_updatedAt
WHERE
  id = p_id;

END;