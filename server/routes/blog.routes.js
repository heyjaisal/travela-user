const express = require("express");
const { getBlogs, getBlogById, Like, SaveBlog, } = require("../controllers/blog.controller");
const authorization = require("../middleware/authentication");
const CheckMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/",CheckMiddleware, getBlogs);
router.get("/:id", getBlogById);
router.post("/:id/like",authorization,Like);

module.exports = router;
