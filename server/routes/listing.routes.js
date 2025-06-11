const express = require("express");
const { getListings, listing, detailList, BookedListings, hostProfileLising, HomepageContent, UpdateHomepageSection, getBookingDetailsById, getHomepageContent, updateHomepageContent, savedListing } = require("../controllers/listing.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();


router.get('/',listing);
router.get('/details/:id',detailList);
router.get('/bookings/:id', getBookingDetailsById);
router.get("/homepage-content", getHomepageContent);
router.post("/homepage-content", updateHomepageContent);
router.get('/host/profile/:id/listings',hostProfileLising)
router.get('/booked/all-item',authMiddleware,BookedListings);
router.get('/saved', authMiddleware, savedListing);
router.get('/all-items',authMiddleware,getListings);

module.exports = router;
