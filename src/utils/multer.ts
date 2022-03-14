import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

// customized options limitations
const limits = {
  fileSize: 1000000000, //1gb
  files: 1,
}

const uploader = multer({ storage, limits }).single('file')

export default uploader