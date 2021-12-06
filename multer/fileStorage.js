const multer = require("multer");
const path = require("path");

exports.fileStorage = multer.diskStorage({
  destination: "workUploads",
  filename: (req, file, cb) => {
    cb(null, req.body.workId + path.extname(file.originalname));
  },
});
