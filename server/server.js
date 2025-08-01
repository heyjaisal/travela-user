const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const gauthRoutes = require('./routes/Gauth.routes');
const uploadRoute = require('./routes/upload.routes');
const blogRoutes = require('./routes/blog.routes');
const listingRoutes = require('./routes/listing.routes');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/messages.routes');
const checkoutRoutes = require('./routes/checkout.routes');
const setupSocketServer = require('./sockets');

const app = express();
const server = http.createServer(app);

// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5175',
  'https://user.jaisal.blog',
  'https://host.jaisal.blog',
];

// ✅ CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Middleware
app.set('trust proxy', 1); // Trust reverse proxy
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.jaisal.blog' : undefined,
  },
}));

// ✅ Passport Auth
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// ✅ Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
app.set('io', io);
setupSocketServer(io);

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoute);
app.use('/api/blogs', blogRoutes);
app.use('/api/user', userRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/chat', chatRoutes);
app.use(gauthRoutes); // Google OAuth

// ✅ Health Check
app.get('/health', (_, res) => res.send({ status: 'ok' }));

// ✅ DB Connection + Server Start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[DB] ✅ Connected to MongoDB');

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`[Server] 🚀 Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('[DB] ❌ Connection error:', err.message);
    process.exit(1);
  }
};

startServer();
