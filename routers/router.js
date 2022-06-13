const path = require('path')
const express = require('express')
const multer = require('multer')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    }
})

const upload = multer({storage: fileStorageEngine})

const router = express.Router();

router.post('/report/image', upload.array("images"), (req, res) => {
    const files = req.files;

    let images = [];
    
    if(files.length > 0) {
        images = files.map(file => `images/${file.filename}`)
    }

    res.status(200).json({images})
})

module.exports = router;