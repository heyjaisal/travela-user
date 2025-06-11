const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Ticket");
const Events = require("../models/Event");
const Reserve = require("../models/Booking");
const QRCode = require("qrcode");
const cloudinary = require("../config/cloudinary");

exports.eventCheckoutSession = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "User id is required" });
  }
  try {
    const {
      eventId,
      title,
      location,
      image,
      hostId,
      ticketCount,
      ticketPrice,
      hostName,
    } = req.body;

    if (
      !eventId ||
      !title ||
      !location ||
      !hostId ||
      !ticketCount ||
      !ticketPrice
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const platformFee =
      Math.round(ticketPrice * ticketCount * 0.04 * 100) / 100;
    const totalPrice =
      Math.round((ticketPrice * ticketCount + platformFee) * 100) / 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      payment_intent_data: { capture_method: "manual" },
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${title} - ${ticketCount} Ticket(s)`,
              description: `Location: ${location}\nHost: ${hostName}`,
              images: image ? [image] : [],
            },
            unit_amount: Math.round(ticketPrice * 100),
          },
          quantity: ticketCount,
        },
      ],
      metadata: {
        eventId,
        hostId,
        userId,
        ticketCount,
        totalPrice,
        platformFee,
        hostName,
      },
      success_url: `${process.env.CLIENT_URL}/event-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/event/${eventId}`,
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.propertyCheckoutSession = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "User id is required" });
  }

  try {
    const {
      propertyId,
      title,
      location,
      image,
      hostId,
      checkIn,
      checkOut,
      hostName,
      price,
      guests,
    } = req.body;

 

    const guest = parseInt(guests, 10) || 1;

    if (
      !propertyId ||
      !title ||
      !location ||
      !hostId ||
      !checkIn ||
      !checkOut ||
      !price
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const checkInDate = new Date(checkIn).setHours(0, 0, 0, 0);
    const checkOutDate = new Date(checkOut).setHours(0, 0, 0, 0);

    let Nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (Nights < 1) Nights = 1;

    const platformFee = Math.round(price * Nights * 0.04 * 100) / 100;
    const totalPrice = Math.round((price * Nights + platformFee) * 100) / 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      payment_intent_data: { capture_method: "manual" },
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${title} - ${Nights} Night${Nights > 1 ? "s" : ""}`,
              description: `Location: ${location}\nHost: ${hostName} \nGuest ${guest}`,
              images: image ? [image] : [],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: Nights,
        },
      ],
      metadata: {
        propertyId,
        hostId,
        userId,
        Nights,
        totalPrice,
        platformFee,
        hostName,
        checkIn,
        checkOut,
        guest,
      },

      success_url: `${process.env.CLIENT_URL}/property-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/property/${propertyId}`,
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.PropertycapturePayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const {
      propertyId,
      hostId,
      userId,
      guest,
      Nights,
      totalPrice,
      hostName,
      checkIn,
      checkOut,
    } = session.metadata;

    if (!session.payment_intent) {
      return res
        .status(400)
        .json({ error: "Invalid session metadata or payment intent." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );
    if (paymentIntent.status !== "requires_capture") {
      return res
        .status(400)
        .json({
          error: `Payment cannot be captured. Status: ${paymentIntent.status}`,
        });
    }

    const platformFee = Math.round(totalPrice * 0.04);
    
    const booking = await Reserve.create({
      user: userId,
      property: propertyId,
      hostId,
      checkIn,
      checkOut,
      guests: guest,
      Nights,
      totalAmount: totalPrice,
      transactionId: paymentIntent.id,
      bookingStatus: "confirmed",
      paymentStatus: "on-hold",
      refundStatus: "none",
      hostName,
      hostPayoutStatus: "pending",
      isCheckedIn: false,
      platformFee:platformFee,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(booking._id.toString());
    const uploadResponse = await cloudinary.uploader.upload(qrCodeDataUrl, {
      folder: "booking_qrcodes",
      public_id: `booking_${booking._id}`,
    });

    booking.qrCode = uploadResponse.secure_url;
    await booking.save();

    res.status(200).json({
      success: true,
      qrCode: booking.qrCode,
      guest,
      hostName,
      checkIn,
      checkOut,
      totalPrice,
      transactionId: paymentIntent.id,
      bookingStatus: "confirmed",
      paymentStatus: "on-hold",
      refundStatus: "none",
      hostPayoutStatus: "pending",
      platformFee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.EventcapturePayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { eventId, hostId, userId, ticketCount, totalPrice, hostName } =
      session.metadata;

    if (!session.payment_intent) {
      return res
        .status(400)
        .json({ error: "Invalid session metadata or payment intent." });
    }

    const eventDetails = await Events.findById(eventId);
    if (!eventDetails || eventDetails.maxGuests < ticketCount) {
      return res.status(400).json({ error: "Not enough tickets available." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );
    if (paymentIntent.status !== "requires_capture") {
      return res
        .status(400)
        .json({
          error: `Payment cannot be captured. Status: ${paymentIntent.status}`,
        });
    }

    await stripe.paymentIntents.capture(paymentIntent.id);
    const platformFee = Math.round(totalPrice * 0.04);

    const booking = await Booking.create({
      user: userId,
      event: eventId,
      ticketsBooked: ticketCount,
      totalAmount: totalPrice,
      transactionId: paymentIntent.id,
      bookingStatus: "confirmed",
      paymentStatus: "on-hold",
      refundStatus: "none",
      hostId,
      hostName,
      hostPayoutStatus: "pending",
      isCheckedIn: false,
      platformFee,
    });

    await Events.findByIdAndUpdate(eventId, {
      $inc: { maxGuests: -ticketCount },
    });

    const qrCodeDataUrl = await QRCode.toDataURL(booking._id.toString());
    const uploadResponse = await cloudinary.uploader.upload(qrCodeDataUrl, {
      folder: "booking_qrcodes",
      public_id: `booking_${booking._id}`,
    });

    booking.qrCode = uploadResponse.secure_url;
    await booking.save();

    res.status(200).json({
      success: true,
      qrCode: booking.qrCode,
      hostName,
      ticketCount,
      totalPrice,
      transactionId: paymentIntent.id,
      bookingStatus: "confirmed",
      paymentStatus: "on-hold",
      refundStatus: "none",
      hostPayoutStatus: "pending",
      platformFee:platformFee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestRefund = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing' });
    }

    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const booking = await Reserve.findById(bookingId).populate('hostId');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user.toString() !== userId) {
      return res.status(403).json({ error: 'You are not allowed to refund this booking' });
    }

    const now = new Date();
    if (now >= booking.checkIn) {
      return res.status(400).json({ error: 'Refund not allowed after check-in date' });
    }

    if (booking.refundStatus === 'processed' || booking.paymentStatus === 'refunded') {
      return res.status(400).json({ error: 'Booking already refunded' });
    }

    const totalAmount = booking.totalAmount;
    const platformFee = booking.platformFee || (totalAmount * 0.04);
    const hostCompensationPercent = 0.10;
    const hostCompensatedAmount = Math.round(totalAmount * hostCompensationPercent);
    const refundAmount = totalAmount - platformFee - hostCompensatedAmount;

    if (!booking.transactionId) {
      return res.status(400).json({ error: 'No payment transaction associated with this booking' });
    }


    const refund = await stripe.refunds.create({
      payment_intent: booking.transactionId,
      amount: Math.round(refundAmount * 100),
    });

    if (!booking.hostId || !booking.hostId.stripeAccountId) {
      return res.status(500).json({ error: "Host Stripe account ID missing. Manual payout required." });
    }

    const transfer = await stripe.transfers.create({
      amount: Math.round(hostCompensatedAmount * 100),
      currency: "inr",
      destination: booking.hostId.stripeAccountId,
      transfer_group: booking.transactionId,
    });

    booking.refundStatus = 'processed';
    booking.paymentStatus = 'refunded';
    booking.bookingStatus = 'canceled';
    booking.hostPayoutStatus = 'partial';
    booking.hostCompensatedAmount = hostCompensatedAmount;
    booking.hostTransferId = transfer.id;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed and host compensated.',
      refundAmount,
      hostCompensatedAmount,
      platformFee,
      refundId: refund.id,
      transferId: transfer.id,
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: error.message });
  }
};
