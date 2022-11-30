const nanoid = require("nanoid");

const addComments = (originalComments, commentsToAdd, parentId) => {
  const parentIndex = originalComments.findIndex(
    (comment) => comment.id === parentId
  );
  originalComments.splice(parentIndex + 1, 0, ...commentsToAdd);
  return originalComments;
};

module.exports = (commentsRepository) => {
  const commentController = {
    getAllComments: (req, res) => {
      new Promise((resolve, reject) => {
        commentsRepository
          .getAllComments()
          .then((data) => {
            if (data[0][0].length > 0) {
              resolve(data[0][0]);
            } else {
              reject({
                status: 404,
                error: { message: "Comments not found." },
              });
            }
          })
          .catch((err) => {
            reject({
              status: 500,
              error: err,
            });
          });
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    getPostComments: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        const { loggedInUserId } = req.query;
        if (postId && loggedInUserId) {
          commentsRepository
            .checkIfPostExists(postId)
            .then((data) => {
              console.log(data[0][0]);
              if (data[0][0][0]["COUNT(id)"] > 0) {
                commentsRepository
                  .getPostComments(postId, loggedInUserId)
                  .then((data) => {
                    resolve(data[0][0]);
                  })
                  .catch((err) => {
                    reject({
                      status: 500,
                      error: err,
                    });
                  });
              } else {
                reject({
                  status: 404,
                  error: { message: "Post not found." },
                });
              }
            })
            .catch((err) => {
              reject({
                status: 500,
                error: err,
              });
            });
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing parameter postId" },
          });
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    postComment: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        const { userId, username, comment, parentId } = req.body;
        const parentLevel = parseInt(req.query.parentLevel);
        // console.log("PARENT", typeof parentLevel);
        const id = nanoid.nanoid();

        if (userId && username && comment && parentId) {
          commentsRepository
            .checkIfPostExists(postId)
            .then((data) => {
              if (data[0][0].length > 0) {
                commentsRepository
                  .checkIfUserExists(userId)
                  .then((userData) => {
                    if (userData[0][0].length > 0) {
                      // console.log(userId, username, comment, parentId);
                      // console.log("USER!", userData[0][0][0].profilePicture);
                      commentsRepository
                        .createComment(
                          id,
                          userId,
                          username,
                          userData[0][0][0].profilePicture,
                          postId,
                          parentId,
                          comment,
                          Date.now(),
                          parentLevel
                        )
                        .then(() => {
                          commentsRepository
                            .clearCachedCommentsForPost(postId)
                            .then(() => {
                              resolve({
                                id: id,
                                userId: userId,
                                username: username,
                                userProfilePicture:
                                  userData[0][0][0].profilePicture,
                                postId: postId,
                                parentId: parentId,
                                body: comment,
                                createdAt: Date.now(),
                                level: parentLevel + 1,
                                upvotes: 0,
                                downvotes: 0,
                                childrenCount: 0,
                                myVote: 0,
                              });
                            })
                            .catch((err) => {
                              reject({
                                status: 500,
                                error: err,
                              });
                            });
                        })
                        .catch((err) => {
                          console.error(err);
                          reject({
                            status: 500,
                            error: err,
                          });
                        });
                    } else {
                      reject({
                        status: 404,
                        error: { message: "User not found." },
                      });
                    }
                  })
                  .catch((err) => {
                    reject({
                      status: 500,
                      error: err,
                    });
                  });
              } else {
                reject({
                  status: 404,
                  error: { message: "Post not found." },
                });
              }
            })
            .catch((err) =>
              reject({
                status: 500,
                error: err,
              })
            );
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing parameters." },
          });
        }
      })
        .then((data) => {
          res.status(201).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    getOneComment: (req, res) => {
      new Promise((resolve, reject) => {
        const { commentId } = req.params;
        // probably need a checker if the subreddit also exists
        commentsRepository
          .checkIfCommentExists(commentId)
          .then((data) => {
            if (data[0][0][0]["COUNT(id)"] === 0) {
              reject({ status: 404, error: { message: "Comment not found." } });
            } else {
              commentsRepository
                .getOneComment(commentId)
                .then((data) => {
                  resolve(data[0][0][0]);
                })
                .catch((err) => {
                  reject({
                    status: 500,
                    error: err,
                  });
                });
            }
          })
          .catch((err) => {
            reject({
              status: 500,
              error: err,
            });
          });
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    getParentCommentsFromPost: (req, res) => {
      new Promise((resolve, reject) => {
        const { postId } = req.params;
        const { loggedInUserId } = req.query;
        // console.log(loggedInUserId);
        if (postId && loggedInUserId) {
          commentsRepository
            .getNextComments(postId, loggedInUserId)
            .then((data) => {
              let comments = data[0][0];

              commentsRepository
                .getCommentsFromCache(postId, loggedInUserId)
                .then((cachedComments) => {
                  if (cachedComments) {
                    for (let comment of cachedComments) {
                      comment = JSON.parse(comment);
                      addComments(
                        comments,
                        comment.childrenComments,
                        comment.parentId
                      );
                    }
                  }

                  resolve(comments);
                });
            })
            .catch((err) => {
              reject({
                status: 500,
                error: err,
              });
            });
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing parameters." },
          });
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    getNextComments: (req, res) => {
      new Promise((resolve, reject) => {
        const { postId } = req.params;
        const { parentId, loggedInUserId } = req.query;

        if (parentId && postId && loggedInUserId) {
          commentsRepository
            .getNextComments(parentId, loggedInUserId)
            .then((data) => {
              const comments = data[0][0];
              commentsRepository
                .setParentCommentsToCache(
                  postId,
                  comments[0].level,
                  parentId,
                  comments
                )
                .catch((err) => {
                  reject({ status: 500, error: err });
                });

              resolve(comments);
            })
            .catch((err) => {
              reject({
                status: 500,
                error: err,
              });
            });
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing parameters." },
          });
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    putComment: (req, res) => {
      new Promise((resolve, reject) => {
        const commentId = req.params.commentId;
        const { comment } = req.body;

        if (commentId && comment) {
          commentsRepository
            .changeComment(commentId, comment)
            .then(() => {
              resolve({
                message: `Successfully edited comment with id: ${id}`,
                id: commentId,
                comment: comment,
              });
            })
            .catch((err) => {
              reject({
                status: 500,
                error: err,
              });
            });
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing parameter/s." },
          });
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    deleteComment: (req, res) => {
      // need ng subreddit if exists checker?
      new Promise((resolve, reject) => {
        const commentId = req.params.commentId;
        commentsRepository
          .checkIfCommentExists(commentId)
          .then((data) => {
            if (data[0][0][0]["COUNT(id)"] === 0) {
              reject({
                status: 404,
                error: { message: "Comment not found." },
              });
            } else {
              commentsRepository
                .deleteComment(commentId)
                .then(() => {
                  resolve(commentId);
                })
                .catch((err) => {
                  reject({
                    status: 500,
                    error: err,
                  });
                });
            }
          })
          .catch((err) => {
            reject({
              status: 500,
              error: err,
            });
          });
      })
        .then((id) => {
          res.status(200).json({
            message: `Successfully deleted comment with the id of ${id} `,
          });
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    voteComment: (req, res) => {
      new Promise((resolve, reject) => {
        const { postId, commentId } = req.params;
        const { userId, vote } = req.body;
        if (commentId && userId && vote) {
          if (vote > 1 || vote < -1) {
            reject({
              status: 400,
              error: { message: "Invalid vote value." },
            });
          } else {
            commentsRepository
              .checkIfCommentExists(commentId)
              .then((data) => {
                if (data[0][0][0]["COUNT(id)"] === 0) {
                  reject({
                    status: 404,
                    error: { message: "Comment not found." },
                  });
                } else {
                  commentsRepository
                    .checkIfUserExists(userId)
                    .then((data) => {
                      if (data[0][0].length === 0) {
                        reject({
                          status: 404,
                          error: { message: "User not found." },
                        });
                      } else {
                        commentsRepository
                          .checkIfUserHasVoted(userId, commentId)
                          .then((voteData) => {
                            // console.log(
                            //   "🚀 ~ file: comment.controller.js ~ line 429 ~ .then ~ voteData",
                            //   voteData[0][0]
                            // );
                            if (voteData[0][0].length === 0) {
                              commentsRepository
                                .voteComment(userId, commentId, vote)
                                .then(() => {
                                  commentsRepository
                                    .clearCachedCommentsForPost(postId)
                                    .then(() => {
                                      resolve({
                                        message: `Successfully voted comment with id: ${commentId}`,
                                        userId: userId,
                                        vote: vote,
                                      });
                                    })
                                    .catch((err) => {
                                      reject({
                                        status: 500,
                                        error: err,
                                      });
                                    });
                                })
                                .catch((err) => {
                                  reject({
                                    status: 500,
                                    error: err,
                                  });
                                });
                            } else {
                              commentsRepository
                                .deleteVote(userId, commentId)
                                .then(() => {
                                  if (voteData[0][0][0].vote === vote) {
                                    if (vote === 1) {
                                      commentsRepository
                                        .decrementCommentUpvote(commentId)
                                        .then(() => {
                                          commentsRepository
                                            .clearCachedCommentsForPost(postId)
                                            .then(() => {
                                              resolve({
                                                message: `Successfully removed upvote from comment with id: ${commentId}`,
                                                userId: userId,
                                                vote: vote,
                                              });
                                            })
                                            .catch((err) => {
                                              reject({
                                                status: 500,
                                                error: err,
                                              });
                                            });
                                        })
                                        .catch((err) => {
                                          reject({ status: 500, error: err });
                                        });
                                    } else if (vote === -1) {
                                      commentsRepository
                                        .decrementCommentDownvote(commentId)
                                        .then(() => {
                                          commentsRepository
                                            .clearCachedCommentsForPost(postId)
                                            .then(() => {
                                              resolve({
                                                message: `Successfully removed downvote from comment with id: ${commentId}`,
                                                userId: userId,
                                                vote: vote,
                                              });
                                            })
                                            .catch((err) => {
                                              reject({
                                                status: 500,
                                                error: err,
                                              });
                                            });
                                        })
                                        .catch((err) => {
                                          reject({ status: 500, error: err });
                                        });
                                    }
                                  } else {
                                    if (voteData[0][0][0].vote === 1) {
                                      commentsRepository
                                        .decrementCommentUpvote(commentId)
                                        .then(() => {
                                          commentsRepository
                                            .voteComment(
                                              userId,
                                              commentId,
                                              vote
                                            )
                                            .then(() => {
                                              commentsRepository
                                                .clearCachedCommentsForPost(
                                                  postId
                                                )
                                                .then(() => {
                                                  resolve({
                                                    message: `Successfully voted comment with id: ${commentId}`,
                                                    userId: userId,
                                                    vote: vote,
                                                  });
                                                })
                                                .catch((err) => {
                                                  reject({
                                                    status: 500,
                                                    error: err,
                                                  });
                                                });
                                            });
                                        })
                                        .catch((err) => {
                                          reject({ status: 500, error: err });
                                        });
                                    } else if (voteData[0][0][0].vote === -1) {
                                      commentsRepository
                                        .decrementCommentDownvote(commentId)
                                        .then(() => {
                                          commentsRepository
                                            .voteComment(
                                              userId,
                                              commentId,
                                              vote
                                            )
                                            .then(() => {
                                              commentsRepository
                                                .clearCachedCommentsForPost(
                                                  postId
                                                )
                                                .then(() => {
                                                  resolve({
                                                    message: `Successfully voted comment with id: ${commentId}`,
                                                    userId: userId,
                                                    vote: vote,
                                                  });
                                                })
                                                .catch((err) => {
                                                  reject({
                                                    status: 500,
                                                    error: err,
                                                  });
                                                });
                                            })
                                            .catch((err) => {
                                              reject({
                                                status: 500,
                                                error: err,
                                              });
                                            });
                                        })
                                        .catch((err) => {
                                          reject({ status: 500, error: err });
                                        });
                                    }
                                  }
                                })
                                .catch((err) => {
                                  reject({ status: 500, error: err });
                                });
                            }
                          })
                          .catch((err) => {
                            reject({
                              status: 500,
                              error: err,
                            });
                          });
                      }
                    })
                    .catch((err) => {
                      reject({
                        status: 500,
                        error: err,
                      });
                    });
                }
              })
              .catch((err) => {
                reject({ status: 500, err: err });
              });
          }
        } else {
          reject({
            status: 400,
            error: { message: "Missing required fields." },
          });
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },
  };
  return commentController;
};
