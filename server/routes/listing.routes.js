const express = require("express");
const { getListings, listing, detailList, BookedListings, hostProfileLising } = require("../controllers/listing.controller");
const CheckMiddleware = require("../middleware/auth.middleware");
const authMiddleware = require("../middleware/authentication");
const router = express.Router();


router.get('/',listing);
router.get('/details/:id',detailList);
router.get('/host/profile/:id/listings',hostProfileLising)
router.get('/booked/all-item',authMiddleware,BookedListings)
router.get('/all-items',CheckMiddleware,getListings);

module.exports = router;
