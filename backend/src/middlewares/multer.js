import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/profile-pix')
    },
  filename: function (req, file, cb) {
        const extnsn = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+extnsn)
    }
  })
  
const upload = multer({ storage: storage })
export default upload;