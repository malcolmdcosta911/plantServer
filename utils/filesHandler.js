const multer = require("multer");
var fs = require("fs");
var path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  // storage: multer.memoryStorage(),
  //fieldNameSize - integer - Max field name size (in bytes). Default: 100.
  limits: { fileSize: 307200 }, // Limit file size to 307200 KB  //, files: 3
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

function plantImagesUpload(req, res, next) {
  return new Promise((resolve, reject) => {
    upload.array("images", 3)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("err.code", err.code);
        if (err.code === "LIMIT_FILE_COUNT") {
          // Handle the file count limit error
          reject(new Error("Max 3 images allowed."));
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
          //when images names wrong or limit exceeded
          reject(new Error("Unexpected images"));
        } else {
          reject(err);
        }
      } else if (err) {
        // An unknown error occurred when uploading.
        reject(err);
      } else {
        // Everything went fine.
        // resolve();
        // Check if at least one image was uploaded
        if (!req.files || req.files.length === 0) {
          reject(new Error("At least one image is required."));
        } else {
          resolve();
        }
      }
    });
  });
}

module.exports = plantImagesUpload;

//the body-parser middleware does not support parsing multipart/form-data, which is typically used for file uploads.
//To handle multipart/form-data, you should use a different middleware, such as multer.
// If there's any middleware that modifies the request before Multer processes it, it might cause issues
