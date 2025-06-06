const express = require('express')
const authorization = require("../middleware/authentication");
const upload = require('../middleware/multer');
const { uploadImage, deleteImage, BlogPost } = require('../controllers/create.controller');
const router = express.Router();

router.post('/upload',authorization, upload.single('image'), uploadImage);
router.delete('/delete',authorization, deleteImage);
router.post("/blogs",authorization,BlogPost)

module.exports = router;