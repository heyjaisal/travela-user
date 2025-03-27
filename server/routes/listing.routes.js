const express = require("express");
// const authorization = require("../middleware/authentication");
const { getListings, listing, detailList } = require("../controllers/listing.controller");
const CheckMiddleware = require("../middleware/auth.middleware");
const router = express.Router();


router.get('/',listing);
router.get('/details/:id',detailList);

router.get('/all-items',CheckMiddleware,getListings);

module.exports = router;
