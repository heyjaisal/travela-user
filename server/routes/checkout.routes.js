const express = require("express");
const { createCheckoutSession, capturePayment } = require("../controllers/checkout.controller");
const router = express.Router();

// router.post('/payment',checkout)
router.post("/event", createCheckoutSession);
router.post("/capture-payment", capturePayment);

module.exports = router;