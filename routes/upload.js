const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: `${__dirname}/../nas/file`,
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const uploader = multer({ storage });

router.get('/', (req, res, next) => {
    res.render('upload', { title: 'Upload Movies'});
});

router.post('/add', uploader.single('file'), (req, res) => {
    console.log(req.file);
    if (req.file === null) {
        return res.status(400).json({ msg: 'No file uploaded'});
    }
    const file = req.file;
    fs.rename(`${__dirname}/../nas/file/${file.filename}`, `${__dirname}/../frontend/public/uploads/${file.filename}`, err => {
        if(err) {
            console.error(err);
            return res.status(500).send(err);
        }
    })
    res.json({ url: `/uploads/${file.filename}`, fileName: file.filename });
})

module.exports = router;