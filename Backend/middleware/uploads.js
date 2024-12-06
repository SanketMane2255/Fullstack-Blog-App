const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null, 'uploads/blog_images')
    },
    filename: (req,file,cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null,filename);
    },
});

const upload = multer({
    storage,
    limits:{fileSize: 10 * 1024 * 1024},
    fileFilter: (req,file,cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
          }
          cb(null, true);
    },
});

exports.upload = upload