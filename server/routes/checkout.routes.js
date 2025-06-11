const express = require("express");
const { eventCheckoutSession, EventcapturePayment,PropertycapturePayment ,propertyCheckoutSession, requestRefund} = require("../controllers/checkout.controller");
const authMiddleware = require("../middleware/authentication");
const router = express.Router();

router.post("/event",authMiddleware, eventCheckoutSession);
router.post("/property",authMiddleware, propertyCheckoutSession);
router.post('/refunds/request', authMiddleware, requestRefund);
router.post("/Ecapture-payment", EventcapturePayment);
router.post("/Pcapture-payment", PropertycapturePayment);

module.exports = router;