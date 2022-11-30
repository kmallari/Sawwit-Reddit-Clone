const nanoid = require("nanoid");
const ogs = require("open-graph-scraper");
const { postUpload } = require("../utils/storage.js");

const isValidTitle = (title) => {
  return title.length > 0 && title.length <= 300;
};

const isValidPostBody = (body) => {
  return body.length >= 0 && body.length <= 40000;
};

module.exports = (postsRepository) => {
  const postController = {
    getAllPosts: (req, res) => {
      new Promise((resolve, reject) => {
        postsRepository
          .getAllPosts()
          .then((data) => {
            if (data[0][0].length > 0) {
              resolve(data[0][0]);
            } else {
              reject({
                status: 404,
                error: { message: "Posts not found." },
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

    getPostsFromSubreddit: (req, res) => {
      new Promise((resolve, reject) => {
        const subredditName = req.params.subreddit;

        postsRepository
          .getAllPostsFromSubreddit(subredditName)
          .then((data) => {
            // console.log(data[0][0]);
            if (data[0][0].length > 0) {
              resolve(data[0][0]);
            } else {
              reject({
                status: 404,
                error: { message: "Posts not found." },
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

    getOnePost: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        const { loggedInUserId } = req.query;
        if (postId && loggedInUserId) {
          postsRepository
            .checkIfPostExists(postId)
            .then((data) => {
              if (data[0][0][0]["COUNT(id)"] === 0) {
                reject({
                  status: 404,
                  error: { message: "Post not found." },
                });
              } else {
                postsRepository
                  .getOnePost(postId, loggedInUserId)
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
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing post ID." },
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

    getUserPosts: (req, res) => {
      new Promise((resolve, reject) => {
        const userId = req.params.userId;
        if (userId) {
          postsRepository
            .checkIfUserExists(userId)
            .then((data) => {
              if (data[0][0].length === 0) {
                reject({ status: 404, error: { message: "User not found." } });
              } else {
                postsRepository
                  .getUserPosts(userId)
                  .then((data) => {
                    resolve(data[0][0]);
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
        } else {
          reject({
            status: 400,
            error: { message: "Invalid/missing user ID." },
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

    getAllPostsUsingPagination: (req, res) => {
      new Promise((resolve, reject) => {
        let { page, itemsPerPage, loggedInUserId } = req.query;
        page = parseInt(page);
        itemsPerPage = parseInt(itemsPerPage);

        // console.log(page, itemsPerPage, loggedInUserId);

        if (page && itemsPerPage && loggedInUserId) {
          // page 1 -> 0 - 4
          // page 2 -> 5 - 9

          const start = (page - 1) * itemsPerPage;

          postsRepository
            .getAllPostsUsingPagination(start, itemsPerPage, loggedInUserId)
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

    getSubredditPostsUsingPagination: (req, res) => {
      new Promise((resolve, reject) => {
        let { page, itemsPerPage, loggedInUserId } = req.query;

        page = parseInt(page);
        itemsPerPage = parseInt(itemsPerPage);

        if (page && itemsPerPage && loggedInUserId) {
          // page 1 -> 0 - 9
          // page 2 -> 10 - 19

          const start = (page - 1) * itemsPerPage;

          const subredditName = req.params.subreddit;

          postsRepository
            .getSubredditPostsUsingPagination(
              start,
              itemsPerPage,
              subredditName,
              loggedInUserId
            )
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
            status: 400,
            error: { message: "Invalid/missing page or itemsPerPage." },
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

    getUserPostsUsingPagination: (req, res) => {
      new Promise((resolve, reject) => {
        let { page, itemsPerPage, loggedInUserId } = req.query;

        page = parseInt(page);
        itemsPerPage = parseInt(itemsPerPage);

        if (page && itemsPerPage && loggedInUserId) {
          // page 1 -> 0 - 9
          // page 2 -> 10 - 19

          const start = (page - 1) * itemsPerPage;
          const userId = req.params.userId;

          postsRepository
            .getUserPostsUsingPagination(
              start,
              itemsPerPage,
              userId,
              loggedInUserId
            )
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
            status: 400,
            error: { message: "Invalid/missing page or itemsPerPage." },
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

    createPost: (req, res) => {
      new Promise((resolve, reject) => {
        let { title, body, url, userId, username, subreddit, type } = req.body;

        if (body === undefined) body = "";

        type = parseInt(type);

        // types:
        // 1 - text
        // 2 - image
        // 3 - url

        const image = req.file;

        // console.log(title, body, url, userId, username, subreddit, type, image);

        if (title && userId && username && subreddit && type) {
          if (isValidTitle(title)) {
            if (isValidPostBody(body)) {
              postsRepository
                .checkIfSubredditExists(subreddit)
                .then((subredditData) => {
                  if (subredditData[0][0].length === 0) {
                    reject({
                      status: 404,
                      error: { message: "Subreddit not found." },
                    });
                  } else {
                    postsRepository
                      .checkIfUserExists(userId)
                      .then((userData) => {
                        if (userData[0][0].length === 0) {
                          reject({
                            status: 404,
                            error: { message: "User not found." },
                          });
                        } else {
                          const id = nanoid.nanoid();

                          if (type === 1) {
                            postsRepository
                              .createTextPost(
                                id,
                                userId,
                                username,
                                title,
                                body,
                                subreddit,
                                subredditData[0][0][0].icon,
                                Date.now()
                              )
                              .then(() => {
                                resolve({
                                  id: id,
                                  userId: userId,
                                  username: username,
                                  title: title,
                                  body: body,
                                  subreddit: subreddit,
                                  subredditIcon: subredditData[0][0][0].icon,
                                });
                              })
                              .catch((err) => {
                                reject({
                                  status: 500,
                                  error: err,
                                });
                              });
                          } else if (type === 2) {
                            if (image) {
                               const imagePath =
                                "http://localhost:8080/uploads/posts/" +
                                image.filename;

                              postUpload.single();

                              postsRepository
                                .createImagePost(
                                  id,
                                  userId,
                                  username,
                                  title,
                                  imagePath,
                                  subreddit,
                                  subredditData[0][0][0].icon,
                                  Date.now()
                                )
                                .then(() => {
                                  resolve({
                                    id: id,
                                    userId: userId,
                                    username: username,
                                    title: title,
                                    image: imagePath,
                                    subreddit: subreddit,
                                    subredditIcon: subredditData[0][0][0].icon,
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
                                status: 400,
                                error: { message: "Missing image." },
                              });
                            }
                          } else if (type === 3) {
                            if (url) {
                              // testURL: (req, res) => {
                              //   const options = {
                              //     url: "https://www.businessinsider.com/biden-us-use-force-against-iran-nuclear-program-as-last-resort-2022-7",
                              //   };

                              //   ogs(options, (error, results, response) => {
                              //     const imageLink = results.ogImage.url;
                              //     res.status(200).json({ imageLink });
                              //   });
                              // },

                              const options = { url };
                              ogs(options, (error, results, response) => {
                                if (error) {
                                  reject({
                                    status: 500,
                                    error: error,
                                  });
                                } else if (results) {
                                  const imageLink = results.ogImage.url;
                                  postsRepository
                                    .createURLPost(
                                      id,
                                      userId,
                                      username,
                                      title,
                                      url,
                                      imageLink,
                                      subreddit,
                                      subredditData[0][0][0].icon,
                                      Date.now()
                                    )
                                    .then(() => {
                                      resolve({
                                        id: id,
                                        userId: userId,
                                        username: username,
                                        title: title,
                                        url: url,
                                        linkPreview: imageLink,
                                        subreddit: subreddit,
                                        subredditIcon:
                                          subredditData[0][0][0].icon,
                                      });
                                    })
                                    .catch((err) => {
                                      reject({
                                        status: 500,
                                        error: err,
                                      });
                                    });
                                }
                              });
                            } else {
                              reject({
                                status: 400,
                                error: { message: "Missing url." },
                              });
                            }
                          }
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
                  console.error(err);
                  reject({
                    status: 500,
                    error: err,
                  });
                });
            } else {
              reject({
                status: 400,
                error: { message: "Post body must have 0-40000 characters." },
              });
            }
          } else {
            reject({
              status: 400,
              error: { message: "Title must have 0-100 characters." },
            });
          }
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
          res.status(error.status).json({ error: error.error });
        });
    },

    testMedia: (req, res) => {
      if (req.file) {
        const imagePath = req.file.path;
        upload.single();
        res.json({
          path: imagePath,
        });
      }
    },

    putPost: (req, res) => {
      new Promise((resolve, reject) => {
        const { message } = req.body;
        const postId = req.params.postId;

        if (message && postId) {
          postsRepository
            .checkIfPostExists(postId)
            .then((data) => {
              if (data[0][0][0]["COUNT(id)"] === 0) {
                reject({
                  status: 404,
                  error: { message: "Post not found." },
                });
              } else {
                postsRepository
                  .updatePostBody(postId, message)
                  .then(() => {
                    resolve({
                      id: postId,
                      body: message,
                    });
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

    deletePost: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        if (postId) {
          postsRepository
            .doesPostExist(postId)
            .then((data) => {
              if (data[0][0][0]["COUNT(id)"] === 0) {
                reject({
                  status: 404,
                  error: { message: "Post not found." },
                });
              } else {
                postsRepository
                  .deletePost(postId)
                  .then(() => {
                    resolve(postId);
                  })
                  .catch(() => {
                    reject({
                      status: 404,
                      error: { message: "Post not found." },
                    });
                  });
              }
            })
            .catch(() => {
              reject({
                status: 404,
                error: { message: "Post not found." },
              });
            });
        } else {
          reject({
            status: 400,
            error: { message: "Missing/Invalid parameters" },
          });
        }
      })
        .then((postId) => {
          res.status(200).json({
            message: `Successfully deleted post with the id of ${postId}`,
          });
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    votePost: (req, res) => {
      new Promise((resolve, reject) => {
        const postId = req.params.postId;
        const { userId, vote } = req.body;
        if (postId && userId && vote) {
          if (vote > 1 || vote < -1) {
            reject({
              status: 400,
              error: { message: "Invalid vote value." },
            });
          } else {
            postsRepository
              .checkIfPostExists(postId)
              .then((data) => {
                if (data[0][0][0]["COUNT(id)"] === 0) {
                  reject({
                    status: 404,
                    error: { message: "Post not found." },
                  });
                } else {
                  postsRepository
                    .checkIfUserExists(userId)
                    .then((data) => {
                      if (data[0][0].length === 0) {
                        reject({
                          status: 404,
                          error: { message: "User not found." },
                        });
                      } else {
                        postsRepository
                          .checkIfUserHasVoted(userId, postId)
                          .then((voteData) => {
                            if (voteData[0][0].length === 0) {
                              postsRepository
                                .votePost(userId, postId, vote)
                                .then(() => {
                                  resolve({
                                    id: postId,
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
                            } else {
                              postsRepository
                                .deleteVote(userId, postId)
                                .then(() => {
                                  if (voteData[0][0][0].vote === vote) {
                                    // promise all
                                    // kapag existing, check kung anong vote
                                    // if upvote, then call yung decrement upvote sa post table
                                    // if downvote, then call yung decreent downvote sa post table
                                    if (vote === 1) {
                                      postsRepository
                                        .decrementPostUpvote(postId)
                                        .then(() => {
                                          resolve({
                                            id: postId,
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
                                    } else if (vote === -1) {
                                      postsRepository
                                        .decrementPostDownvote(postId)
                                        .then(() => {
                                          resolve({
                                            id: postId,
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
                                    }
                                  } else {
                                    if (voteData[0][0][0].vote === 1) {
                                      postsRepository
                                        .decrementPostUpvote(postId)
                                        .then(() => {
                                          postsRepository
                                            .votePost(userId, postId, vote)
                                            .then(() => {
                                              resolve({
                                                id: postId,
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
                                          reject(err);
                                        });
                                    } else if (voteData[0][0][0].vote === -1) {
                                      postsRepository
                                        .decrementPostDownvote(postId)
                                        .then(() => {
                                          postsRepository
                                            .votePost(userId, postId, vote)
                                            .then(() => {
                                              resolve({
                                                id: postId,
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
                                          reject(err);
                                        });
                                    }
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
                            console.err(err);
                            reject({
                              status: 500,
                              error: {
                                message: err,
                              },
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
                reject({
                  status: 500,
                  error: err,
                });
              });
          }
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
  };
  return postController;
};
