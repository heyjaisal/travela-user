const express = require("express");
const authorization = require("../middleware/authentication");
const { listing } = require("../controllers/listing.controller");
const router = express.Router();

router.get('/all-items',authorization,listing);
module.exports = router;
