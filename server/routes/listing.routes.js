const express = require("express");
const authorization = require("../middleware/authentication");
const { listing,getListings } = require("../controllers/listing.controller");
const router = express.Router();

router.get('/all-items',authorization,getListings);
module.exports = router;
