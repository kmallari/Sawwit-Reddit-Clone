const nanoid = require("nanoid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userUpload } = require("../utils/storage");
const saltRounds = 5;

const isValidUsername = (username) => {
  // username is 4-20 characters long
  // no _ at the beginning and end
  // no __* inside
  // only allows alphanumeric characters and _

  if (/^(?=[a-zA-Z0-9_]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(username)) {
    return true;
  }
  return false;
};

const isValidEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
};

// function for  checking if password is valid using regex
const isValidPassword = (password) => {
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/.test(password)
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = (usersRepository) => {
  const userController = {
    getAllUsers: (req, res) => {
      new Promise((resolve, reject) => {
        usersRepository.getAllUsers().then((data) => {
          if (data[0][0].length == 0) {
            reject({
              status: 404,
              error: { message: "No users found" },
            });
          } else {
            resolve(data[0][0]);
          }
        });
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    registerUser: (req, res) => {
      new Promise((resolve, reject) => {
        const { email, username, password } = req.body;
        const id = nanoid.nanoid();

        usersRepository.checkIfUsernameExists(username).then((data) => {
          if (data[0][0][0]["COUNT(username)"] > 0) {
            // baka pwedeng gawing function sa user repo
            reject({
              status: 409,
              error: { message: "Username is taken." },
            });
          } else {
            usersRepository.checkIfEmailExists(email).then((data) => {
              if (data[0][0][0]["COUNT(email)"] > 0) {
                reject({
                  status: 409,
                  error: { message: "Email is taken." },
                });
              } else {
                if (email && username && password) {
                  // dapat nasa taas
                  if (
                    isValidEmail(email) &&
                    isValidUsername(username) &&
                    isValidPassword(password)
                  ) {
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                      bcrypt.hash(password, salt, (err, hash) => {
                        const now = Date.now();
                        usersRepository
                          .registerUser(
                            id,
                            username,
                            email,
                            hash,
                            "https://i.imgur.com/lccuiDX.png",
                            now
                          )
                          .then(() => {
                            const user = {
                              id: id,
                              username: username,
                              email: email,
                              profilePicture: "https://i.imgur.com/lccuiDX.png",
                              created_at: now,
                            };
                            const token = jwt.sign({ data: user }, "secret");
                            resolve({ data: user, token: token });
                          })
                          .catch((error) => {
                            reject(error);
                          });
                      });
                    });
                  } else {
                    reject({
                      status: 400,
                      error: {
                        message: "Invalid email, username, or password format.",
                      },
                    });
                  }
                } else {
                  reject({
                    status: 400,
                    error: { message: "Missing email, username or password." },
                  });
                }
              }
            });
          }
        });
      })
        .then((data) => {
          res.status(201).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    loginUser: (req, res) => {
      new Promise((resolve, reject) => {
        const { loginInfo, password } = req.body;
        let user;
        if (isValidEmail(loginInfo)) {
          // login info entered is email
          usersRepository.loginUser("", loginInfo).then((data) => {
            // console.log("DATA", data);
            if (data[0][0].length == 0) {
              reject({
                status: 404,
                error: { message: "User not found." },
              });
            }
            user = data[0][0][0];
            // console.log("USER", user);
            bcrypt.compare(password, user.PASSWORD, (err, res) => {
              if (res) {
                delete user.PASSWORD;
                const token = jwt.sign({ data: user }, "secret");
                resolve({ data: user, token: token });
              } else {
                reject({
                  status: 401,
                  error: { message: "Email and password do not match." },
                });
              }
            });
          });
        } else {
          // login info entered is username
          usersRepository.loginUser(loginInfo, "").then((data) => {
            // console.log("DATA", data[0][0].length);

            if (data[0][0].length == 0) {
              return reject({
                status: 404,
                error: { message: "User not found." },
              });
            }
            user = data[0][0][0];
            // console.log("USER", user);

            bcrypt.compare(password, user.PASSWORD, (err, res) => {
              if (res) {
                delete user.PASSWORD;
                const token = jwt.sign({ data: user }, "secret");
                resolve({ data: user, token: token });
              } else {
                reject({
                  status: 401,
                  error: { message: "Email and password do not match." },
                });
              }
            });
          }); // add catch
        }
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    getUser: (req, res) => {
      new Promise((resolve, reject) => {
        const id = req.params.userId;
        if (id) {
          usersRepository
            .checkIfUserExists(id)
            .then((data) => {
              if (data[0][0].length > 0) {
                usersRepository
                  .getUserInformation(id)
                  .then((user) => {
                    resolve(user[0][0][0]);
                  })
                  .catch(() => {
                    reject({
                      status: 404,
                      error: { message: "User information not found." },
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
            error: { message: "ID parameter not found." },
          });
        }
      })
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },

    searchUser: async (req, res) => {
      const searchTerm = req.query.searchTerm + "%";
      try {
        if (searchTerm) {
          const users = await usersRepository.searchUserByUsername(searchTerm);
          if (users[0][0].length > 0) {
            res.status(200).json(users[0][0]);
          } else {
            throw new Error("User not found.");
          }
        } else {
          throw new Error("Search term not found.");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    },

    updateUser: (req, res) => {
      const { email, username, password } = req.body; //
      const profilePicture = req.file;
      const id = req.params.userId;
      new Promise((resolve, reject) => {
        usersRepository.checkIfUserExists(id).then((data) => {
          if (data[0][0].length > 0) {
            let emailValidation;
            if (email) {
              emailValidation = new Promise((resolve, reject) => {
                if (isValidEmail(email)) {
                  usersRepository.checkIfEmailExists(email).then((data) => {
                    if (data[0][0][0]["COUNT(email)"] > 0) {
                      reject({
                        status: 409,
                        error: { message: "Email is already in use." },
                      });
                    } else {
                      resolve(true);
                    }
                  });
                } else {
                  reject({
                    status: 403,
                    error: { message: "Email format is invalid." },
                  });
                }
              });
            }

            let usernameValidation;
            if (username) {
              usernameValidation = new Promise((resolve, reject) => {
                if (isValidUsername) {
                  usersRepository
                    .checkIfUsernameExists(username)
                    .then((data) => {
                      if (data[0][0][0]["COUNT(username)"] > 0) {
                        reject({
                          status: 409,
                          error: { message: "Username is already in use." },
                        });
                      } else {
                        resolve(true);
                      }
                    });
                } else {
                  reject({
                    status: 403,
                    error: { message: "Username format is invalid." },
                  });
                }
              });
            }

            let profilePictureValidation;
            if (profilePicture) {
              profilePictureValidation = new Promise((resolve, reject) => {
                resolve(true);
              });
            }

            let passwordValidation;
            if (password) {
              passwordValidation = new Promise((resolve, reject) => {
                resolve(true);
              });
            }

            Promise.all([
              emailValidation,
              usernameValidation,
              profilePictureValidation,
              passwordValidation,
            ])
              .then((validations) => {
                // validations[0] => emailPromise
                // validations[1] => usernamePromise
                // validations[2] => profilePicturePromise
                // validations[3] => passwordPromise

                // console.log(validations);

                let changeEmail;
                if (validations[0]) {
                  changeEmail = new Promise((resolve, reject) => {
                    usersRepository
                      .updateEmail(id, email)
                      .then(() => {
                        resolve("email");
                      })
                      .catch((err) => {
                        reject({
                          status: 500,
                          error: err,
                        });
                      });
                  });
                }

                let changeUsername;
                if (validations[1]) {
                  changeUsername = new Promise((resolve, reject) => {
                    usersRepository
                      .updateUsername(id, username)
                      .then(() => {
                        resolve("username");
                      })
                      .catch((err) => {
                        reject({
                          status: 500,
                          error: err,
                        });
                      });
                  });
                }

                let changeProfilePicture;
                if (validations[2]) {
                  changeProfilePicture = new Promise((resolve, reject) => {
                    const imagePath =
                      "http://localhost:8080/uploads/users/" +
                      profilePicture.filename;

                    userUpload.single();

                    usersRepository
                      .updateProfilePicture(id, imagePath)
                      .then(() => {
                        resolve(imagePath);
                      })
                      .catch((err) => {
                        reject({
                          status: 500,
                          error: err,
                        });
                      });
                  });
                }

                let changePassword;
                if (validations[3]) {
                  changePassword = new Promise((resolve, reject) => {
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                      bcrypt.hash(password, salt, (err, hash) => {
                        usersRepository
                          .updatePassword(id, hash)
                          .then(() => {
                            resolve("password");
                          })
                          .catch((err) => {
                            reject({
                              status: 500,
                              error: err,
                            });
                          });
                      });
                    });
                  });
                }

                Promise.all([
                  changeEmail,
                  changeUsername,
                  changeProfilePicture,
                  changePassword,
                ]).then((updates) => {
                  if (
                    updates[0] === undefined &&
                    updates[1] === undefined &&
                    updates[2] === undefined &&
                    updates[3] === undefined
                  ) {
                    reject({
                      status: 400,
                      error: { message: "No updates were made." },
                    });
                  } else {
                    resolve(updates);
                  }
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
              status: 404,
              error: {
                message: "User not found.",
              },
            });
          }
        });
      })
        .then((updated) => {
          let updatedFieldsString = "";
          for (let i = 0; i < updated.length; i++) {
            updated[i] !== undefined
              ? (updatedFieldsString += updated[i] + ", ")
              : null;
          }

          // remove last two characters in string
          updatedFieldsString = updatedFieldsString.slice(0, -2);
          const updatedFields = {};
          for (let i = 0; i < updated.length; i++) {
            if (updated[i] !== undefined) {
              if (updated[i] === "email") {
                updatedFields["email"] = email;
              }
              if (updated[i] === "username") {
                updatedFields["username"] = username;
              }
              if (updated[i] === "password") {
                updatedFields["password"] = "$SECRET";
              }
            }
          }

          if (updated[2] !== undefined) {
            updatedFields["profilePicture"] = updated[2];
          }

          res.status(200).json({
            message: `Successfully updated the user's information.`,
            updatedFields: updatedFields,
          });
        })
        .catch((error) => {
          res.status(error.status).json({ error: error.error });
        });
    },

    deleteUser: (req, res) => {
      new Promise((resolve, reject) => {
        const id = req.params.userId;
        usersRepository.checkIfUserExists(id).then((data) => {
          if (data[0][0].length > 0) {
            usersRepository
              .deleteUser(id)
              .then(resolve())
              .catch(() => {
                reject({
                  status: 500,
                  error: {
                    message: "An error occurred while deleting the user.",
                  },
                });
              });
          } else {
            reject({
              status: 404,
              error: {
                message: "User not found.",
              },
            });
          }
        });
      })
        .then((user) => {
          res.status(200).json({
            status: "Successfully deleted user.",
            data: user,
          });
        })
        .catch((error) => {
          res.status(404).json(error.error);
        });
    },
  };
  return userController;
};
