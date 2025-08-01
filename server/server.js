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

// ✅ CORS middleware (must be before routes)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ✅ Handle preflight requests (important for cookies/session)
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Express core middleware
app.set('trust proxy', 1); // Trust reverse proxy (Render, Vercel, etc.)
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Session handling
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Must be true on HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.jaisal.blog' : undefined, // share across subdomains
  },
}));

// ✅ Passport config
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
app.set('io', io);
setupSocketServer(io);

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoute);
app.use('/api/blogs', blogRoutes);
app.use('/api/user', userRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/checkout', checkout);
app.use('/api/chat', chatRoutes);
app.use(authRoute); // Google Auth

// ✅ Health check
app.get('/health', (req, res) => {
  res.send({ status: 'ok' });
});

// ✅ MongoDB + Start server
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
