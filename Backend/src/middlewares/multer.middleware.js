import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

export const upload = multer({ storage });

// Use .fields to handle multiple fields, or .single for one field
export const multerUploads = upload.fields([
  { name: "profilePic", maxCount: 1 }
]);