const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Ticket");
const Host = require("../models/Hosts"); 
const QRCode = require("qrcode");
const cloudinary = require("../config/cloudinary")

exports.createCheckoutSession = async (req, res) => {
  try {
    const { eventId, title, location, image, host, date, ticketCount, ticketPrice, platformFee, totalPrice } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      payment_intent_data: {
        capture_method: "manual",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${title} - ${ticketCount} Ticket(s)`,
              description: `Location: ${location}\nDate: ${date}\nHost: ${host.name}`,
              images: [image],
            },
            unit_amount: ticketPrice * 100,
          },
          quantity: ticketCount,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Platform Fee",
              description: "Service charge for booking",
            },
            unit_amount: platformFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { eventId, hostId: host.id, ticketCount },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&event_id=${eventId}&tickets=${ticketCount}&amount=${totalPrice}`,
      cancel_url: `${process.env.CLIENT_URL}/event/${eventId}`,
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

exports.capturePayment = async (req, res) => {
  try {
    const { sessionId, user, event, ticketsBooked, totalAmount } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.payment_intent) {
      return res
        .status(400)
        .json({ error: "No payment intent found for this session." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );

    if (paymentIntent.status !== "requires_capture") {
      return res.status(400).json({
        error: `Payment cannot be captured. Current status: ${paymentIntent.status}`,
      });
    }


    await stripe.paymentIntents.capture(paymentIntent.id);

   
    const host = await Host.findById(session.metadata.hostId);
    if (!host) {
      return res.status(400).json({ error: "Host not found" });
    }


    const platformFee = Math.round(totalAmount * 0.04);

 
    const booking = new Booking({
      user,
      event,
      ticketsBooked,
      totalAmount,
      transactionId: paymentIntent.id,
      bookingStatus: "confirmed",
      paymentStatus: "on-hold",
      refundStatus: "none",
      hostId: session.metadata.hostId,
      hostPayoutStatus: "pending",
      isCheckedIn: false,
      platformFee: platformFee, 
    });

    await booking.save();

    
    const qrCodeData = `${booking._id}`;
  
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);

    const uploadResponse = await cloudinary.uploader.upload(qrCodeDataUrl, {
      folder: "booking_qrcodes",
      public_id: `booking_${booking._id}`,
      overwrite: true,
    });

    booking.qrCode = uploadResponse.secure_url;
    await booking.save();

    res.status(200).json({ success: true, qrCode: uploadResponse.secure_url });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: error.message });
  }
};

exports.verifyQRCode = async (req, res) => {
  try {
    const { qrCodeData } = req.body;

    const booking = await Booking.findById(qrCodeData)
      .populate('hostId', 'stripeAccountId');
    
    if (!booking) {
      return res.status(400).json({ error: "Invalid QR Code" });
    }

    if (booking.isCheckedIn) {
      return res.status(400).json({ error: "Ticket already used" });
    }

    if (!booking.hostId || !booking.hostId.stripeAccountId) {
      return res.status(400).json({ error: "Host Stripe account not found" });
    }

    
    const qrCodeUrl = booking.qrCode;
    const publicId = qrCodeUrl.split("/").pop().split(".")[0]; 


    await cloudinary.uploader.destroy(`booking_qrcodes/${publicId}`);

    booking.isCheckedIn = true;
    booking.paymentStatus = "released"; 
    booking.hostPayoutStatus = "completed";
    booking.qrCode = undefined;
    await booking.save();


    const transferAmount = Math.round((booking.totalAmount - booking.platformFee) * 100);
    
    const transfer = await stripe.transfers.create({
      amount: transferAmount,
      currency: "usd",
      destination: booking.hostId.stripeAccountId,
      transfer_group: booking.transactionId,
    });

    booking.hostTransferId = transfer.id;
    await booking.save();

    res.status(200).json({ success: true, message: "User Verified, QR deleted & funds transferred!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
