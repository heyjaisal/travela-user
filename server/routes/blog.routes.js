const express = require("express");
const { getBlogs, getBlogById, likeBlog, saveBlog } = require("../controllers/blog.controller");
const authorization = require("../middleware/authentication");
const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/:id/like",authorization, likeBlog);
router.post("/:id/save",authorization, saveBlog);

module.exports = router;
