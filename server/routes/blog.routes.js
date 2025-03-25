const express = require("express");
const { getBlogs, getBlogById, Like, SaveBlog, } = require("../controllers/blog.controller");
const authorization = require("../middleware/authentication");
const router = express.Router();

router.get("/",authorization, getBlogs);
router.get("/:id", getBlogById);
router.post("/:id/like",authorization,Like);

module.exports = router;
