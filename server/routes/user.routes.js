const express = require("express");

const authorization = require("../middleware/authentication");
const { searchUser, getUserBlogs ,userDetails, SaveItem,getReviews,postReviews ,followToggle,Hostfollow, ReportContent} = require("../controllers/user.controller");

const router = express.Router();

router.post("/search", authorization, searchUser);
router.get("/:id", userDetails);
router.get("/:id/blogs", getUserBlogs);
router.post('/save/:id',authorization,SaveItem)
router.post('/reviews/:itemType/:item', authorization, postReviews);
router.get('/reviews/:itemType/:item' , getReviews);
router.post('/report/:type/:id', authorization, ReportContent);
router.post('/:id/follow-toggle', authorization, followToggle);
router.post('/host/:id/follow-toggle', authorization, Hostfollow);


module.exports = router;
