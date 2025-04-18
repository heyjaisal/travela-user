const express = require("express");

const authorization = require("../middleware/authentication");
const { searchUser, getUserBlogs ,userDetails, SaveItem, followToggle,Hostfollow} = require("../controllers/user.controller");
const { Likes } = require("../controllers/blog.controller");
const router = express.Router();

router.post("/search", authorization, searchUser);
router.get("/:id", userDetails);
router.get("/:id/blogs", getUserBlogs);
router.post('/save/:id',authorization,SaveItem)
router.post('/:id/follow-toggle', authorization, followToggle);
router.post('/host/:id/follow-toggle', authorization, Hostfollow);


module.exports = router;
