const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => { //kothy file store hobe ta decide kore ei destination
        cb(null, 'uploads/'); // Ensure 'uploads' folder exists in my root directory, jodi root directory te uploads ei namer kono folder na thake tahole auto create hobena, ajonno error ashbe, tai agei folder manually create korte hobe
    },
    filename: (req, file, cb) => { //unique name a file ta save kortesi
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer with file limit
const upload = multer({
    storage: storage,
    limits: { files: 5 }, // Limit to 5 files
});

module.exports = upload;
