const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,  'assets', 'images'))
        }
    },
    filename: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype!=='image/jpg' && file.mimetype !=='image/jpeg') {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            var fileName = crypto.randomBytes(10).toString('hex');;
            file.filename = fileName;
            cb(null, fileName + '.jpg');
        }
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 1024*1024*2 }
}).single('image');


module.exports.handleMultiPart = upload;