var multer = require("multer");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/app/public/uploads/posts");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/app/public/uploads/users");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const subredditStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/app/public/uploads/subreddits");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const postUpload = multer({
  storage: postStorage,
  fileFilter: fileFilter,
});

const userUpload = multer({
  storage: userStorage,
  fileFilter: fileFilter,
});

const subredditUpload = multer({
  storage: subredditStorage,
  fileFilter: fileFilter,
});

module.exports = { postUpload, userUpload, subredditUpload };
