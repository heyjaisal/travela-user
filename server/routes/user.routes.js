const express = require("express");

const authorization = require("../middleware/authentication");
const { searchUser, getUserBlogs ,userDetails, SaveItem} = require("../controllers/user.controller");
const { Likes } = require("../controllers/blog.controller");
const router = express.Router();

router.post("/search", authorization, searchUser);
router.get("/:id", userDetails);
router.get("/:id/blogs", authorization, getUserBlogs);
router.post('/save/:id',authorization,SaveItem)

module.exports = router;
