const multer = require('multer');
const moment = require('moment');
const {v4} = require('uuid');
multer({
    limits: { fieldSize: 2 * 1024 * 1024 }
});
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        const filename = v4();
        const date = moment().format('DDMMYYYY-HHmmss_SSS')
        cb(null, `${date}-${filename}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4') {
        cb(null, true)
    } else {
        cb(null, false);
    }
}

//Нужно подобрать лимиты
const limits = {
    fileSize: 1024 * 1024 * 5 * 1024
}

module.exports = multer({storage, fileFilter, limits})
