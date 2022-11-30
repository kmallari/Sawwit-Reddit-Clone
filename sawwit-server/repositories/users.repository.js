module.exports = (db) => {
  const usersRepository = {
    getAllUsers: () => {
      return db.raw("CALL GetAllUsers()");
    },
    checkIfUsernameExists: (username) => {
      return db.raw("CALL CheckIfUsernameExists(?)", [username]);
    },
    checkIfEmailExists: (email) => {
      return db.raw("CALL CheckIfEmailExists(?)", [email]);
    },
    checkIfUserExists: (id) => {
      return db.raw("CALL CheckIfIDExists(?)", [id]);
    },
    registerUser: (
      id,
      username,
      email,
      hashPassword,
      profilePicture,
      createdAt
    ) => {
      return db.raw("CALL RegisterUser(?, ?, ?, ?, ?, ?)", [
        id,
        username,
        email,
        hashPassword,
        profilePicture,
        createdAt,
      ]);
    },
    loginUser: (email, username, password) => {
      return db.raw("CALL LoginUser(?, ?)", [username, email]);
    },
    getUserInformation: (id) => {
      return db.raw("CALL GetUserInformation(?)", [id]);
    },
    searchUserByUsername: (username) => {
      return db.raw("CALL SearchUserByUsername(?)", [username])
    },
    updateEmail: (id, email) => {
      return db.raw("CALL UpdateEmail(?, ?)", [id, email]);
    },
    updateUsername: (id, username) => {
      return db.raw("CALL UpdateUsername(?, ?)", [id, username]);
    },
    updatePassword: (id, password) => {
      return db.raw("CALL UpdatePassword(?, ?)", [id, password]);
    },
    updateProfilePicture: (id, profilePicture) => {
      return db.raw("CALL UpdateProfilePicture(?, ?)", [id, profilePicture]);
    },
    deleteUser: (id) => {
      return db.raw("CALL DeleteUser(?)", [id]);
    },
  };
  return usersRepository;
};
