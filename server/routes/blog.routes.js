const express = require('express')
const authorization = require("../middleware/authentication");
const { GetBlog } = require('../controllers/blog.controller');

const router = express.Router();

router.get("/blogs",authorization,GetBlog) 

module.exports = router;