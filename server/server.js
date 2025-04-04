const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/Gauth.routes');
const authRoutes = require('./routes/auth.routes'); 
const uploadRoute = require('./routes/upload.routes');
const blogRoutes = require('./routes/blog.routes');
const listingRoutes = require('./routes/listing.routes');
const userRoutes = require('./routes/user.routes');
const checkout = require("./routes/checkout.routes");

const app = express();
require('dotenv').config();

const mongoURL = process.env.MONGO_URI;
const Port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

require('./config/passport');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes); 
app.use('/api', uploadRoute);
app.use("/api/blogs", blogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);
app.use("/api/checkout", checkout);
app.use(authRoute);

async function startServer() {
  try {
    await mongoose.connect(mongoURL);
    console.log('Database connection done');
    app.listen(Port, () => {
      console.log(`Server running on port ${Port}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
}

startServer();
