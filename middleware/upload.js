import * as path from "node:path";
import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "tmp"));
  },
  filename(req, file, cb) {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);

    cb(null, `${basename}-${req.user.id}${extname}`);
  },
});

export default multer({ storage });
