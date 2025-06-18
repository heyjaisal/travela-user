const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoute = require('./routes/Gauth.routes');
const authRoutes = require('./routes/auth.routes');
const uploadRoute = require('./routes/upload.routes');
const blogRoutes = require('./routes/blog.routes');
const listingRoutes = require('./routes/listing.routes');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/messages.routes');
const checkout = require('./routes/checkout.routes');
const setupSocketServer = require('./sockets');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5175',
  'https://user.jaisal.blog',
  'https://host.jaisal.blog',
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set('io', io);
app.set('trust proxy', 1);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api', uploadRoute);
app.use('/api/blogs', blogRoutes);
app.use('/api/user', userRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/checkout', checkout);
app.use('/api/chat', chatRoutes);
app.use(authRoute);

setupSocketServer(io);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[DB] ✅ Connected to MongoDB');

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`[Server] 🚀 Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('[DB] ❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

startServer();
