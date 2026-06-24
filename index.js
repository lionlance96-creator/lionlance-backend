const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== HEALTH CHECKS (must be first) =====
app.get('/', (req, res) => res.send('🦁 LIONLANCE Backend is running!'));
app.get('/ping', (req, res) => res.send('pong'));
app.get('/hello', (req, res) => res.send('Hello!'));

// ===== DEBUG: List all routes =====
app.get('/routes', (req, res) => {
  const routes = app._router.stack
    .filter(r => r.route)
    .map(r => r.route.path);
  res.json({ routes });
});

console.log('✅ Routes defined before MongoDB connection');

// ===== MONGODB CONNECTION =====
mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(async () => {
    console.log('✅ MongoDB connected');

    // ===== SEED ADMIN =====
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'lionlance1@email.com';
      const adminPass = process.env.ADMIN_PASSWORD || 'Ronald007';
      const existing = await User.findOne({ email: adminEmail.toLowerCase() });
      if (!existing) {
        const hashed = await bcrypt.hash(adminPass, 10);
        const admin = new User({
          email: adminEmail.toLowerCase(),
          password: hashed,
          name: 'Admin',
          isAdmin: true,
          wallet: 0,
        });
        await admin.save();
        console.log('✅ Admin seeded');
      } else {
        console.log('ℹ️ Admin already exists, skipping seed');
      }
    } catch (err) {
      console.error('❌ Admin seed error:', err.message);
    }

    // ===== START SERVER =====
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 LIONLANCE Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ============================================================
// SCHEMAS
// ============================================================
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  wallet: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Number, required: true },
  posterEmail: { type: String, required: true },
  posterName: { type: String, required: true },
  status: { type: String, default: 'open', enum: ['open', 'closed'] },
  createdAt: { type: Date, default: Date.now },
});

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['send', 'receive', 'deposit_company'], required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  recipientAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const PaymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String },
  signature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const Payment = mongoose.model('Payment', PaymentSchema);

// ===== RAZORPAY =====
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===== JWT HELPERS =====
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
  next();
};

// ===== HELPERS =====
const MAX_TRANSACTION = Number(process.env.MAX_TRANSACTION_LIMIT) || 500000;
const BROKERAGE_RATE = 0.10;

const validateAmount = (amount) => {
  if (!amount || amount < 1) return 'Amount must be at least ₹1.';
  if (amount > MAX_TRANSACTION) return `Amount exceeds limit of ₹${MAX_TRANSACTION}.`;
  return null;
};

// ============================================================
// AUTH ROUTES
// ============================================================
app.post('/api/auth/register', async (req, res) => {
  console.log('📝 Register hit');
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const isFirst = (await User.countDocuments()) === 0;
    const user = new User({
      email: email.toLowerCase(),
      password: hashed,
      name,
      isAdmin: isFirst,
    });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin, wallet: user.wallet },
    });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  console.log('🔑 Login hit');
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin, wallet: user.wallet },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  console.log('👤 Me hit');
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('❌ Me error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// USER ROUTES (Admin only)
// ============================================================
app.get('/api/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Users list error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('User detail error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// JOB ROUTES
// ============================================================
app.post('/api/jobs', verifyToken, async (req, res) => {
  console.log('📝 Post job hit');
  try {
    const { title, category, description, budget, deadline } = req.body;
    if (!title || !category || !description || !budget || !deadline) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const error = validateAmount(budget);
    if (error) return res.status(400).json({ error });

    const user = await User.findById(req.user.id);
    const job = new Job({
      title,
      category,
      description,
      budget,
      deadline,
      posterEmail: user.email,
      posterName: user.name,
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error('❌ Post job error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs', async (req, res) => {
  console.log('📋 GET /api/jobs hit');
  try {
    const { category } = req.query;
    const filter = { status: 'open' };
    if (category && category !== 'all') filter.category = category;
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    console.log(`✅ Found ${jobs.length} jobs`);
    res.json(jobs);
  } catch (err) {
    console.error('❌ Jobs error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('Get job by id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/jobs/:id', verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.posterEmail !== req.user.email && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const { status } = req.body;
    if (status) job.status = status;
    await job.save();
    res.json(job);
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/jobs/:id', verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.posterEmail !== req.user.email && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// WALLET ROUTES
// ============================================================
app.get('/api/wallet/balance', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ balance: user.wallet || 0 });
  } catch (err) {
    console.error('Balance error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/wallet/transactions', verifyToken, async (req, res) => {
  try {
    const txs = await Transaction.find({
      $or: [{ from: req.user.email }, { to: req.user.email }],
    }).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    console.error('Transactions error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wallet/add-funds', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const error = validateAmount(amount);
    if (error) return res.status(400).json({ error });

    const user = await User.findById(req.user.id);
    user.wallet = (user.wallet || 0) + amount;
    await user.save();

    const tx = new Transaction({
      type: 'deposit_company',
      from: user.email,
      to: 'system',
      amount,
      fee: 0,
      recipientAmount: amount,
    });
    await tx.save();

    res.json({ message: 'Funds added', balance: user.wallet });
  } catch (err) {
    console.error('Add funds error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wallet/send', verifyToken, async (req, res) => {
  try {
    const { recipientEmail, amount } = req.body;
    if (!recipientEmail) return res.status(400).json({ error: 'Recipient email required' });
    const error = validateAmount(amount);
    if (error) return res.status(400).json({ error });
    if (recipientEmail.toLowerCase() === req.user.email) {
      return res.status(400).json({ error: 'Cannot send to yourself' });
    }

    const sender = await User.findById(req.user.id);
    const recipient = await User.findOne({ email: recipientEmail.toLowerCase() });
    if (!recipient) return res.status(404).json({ error: 'Recipient not found' });
    if ((sender.wallet || 0) < amount) return res.status(400).json({ error: 'Insufficient balance' });

    const fee = Math.round(amount * BROKERAGE_RATE * 100) / 100;
    const recipientAmount = amount - fee;

    sender.wallet = (sender.wallet || 0) - amount;
    recipient.wallet = (recipient.wallet || 0) + recipientAmount;
    await sender.save();
    await recipient.save();

    const tx = new Transaction({
      type: 'send',
      from: sender.email,
      to: recipient.email,
      amount,
      fee,
      recipientAmount,
    });
    await tx.save();

    res.json({
      message: 'Payment sent',
      senderBalance: sender.wallet,
      fee,
      recipientAmount,
    });
  } catch (err) {
    console.error('Send payment error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wallet/receive', verifyToken, async (req, res) => {
  try {
    const { senderEmail, amount } = req.body;
    if (!senderEmail) return res.status(400).json({ error: 'Sender email required' });
    const error = validateAmount(amount);
    if (error) return res.status(400).json({ error });

    const sender = await User.findOne({ email: senderEmail.toLowerCase() });
    const receiver = await User.findById(req.user.id);
    if (!sender) return res.status(404).json({ error: 'Sender not found' });
    if ((sender.wallet || 0) < amount) return res.status(400).json({ error: 'Sender has insufficient balance' });

    const fee = Math.round(amount * BROKERAGE_RATE * 100) / 100;
    const receiverAmount = amount - fee;

    sender.wallet = (sender.wallet || 0) - amount;
    receiver.wallet = (receiver.wallet || 0) + receiverAmount;
    await sender.save();
    await receiver.save();

    const tx = new Transaction({
      type: 'receive',
      from: sender.email,
      to: receiver.email,
      amount,
      fee,
      recipientAmount: receiverAmount,
    });
    await tx.save();

    res.json({
      message: 'Payment received',
      receiverBalance: receiver.wallet,
      fee,
      receiverAmount,
    });
  } catch (err) {
    console.error('Receive payment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// PAYMENT ROUTES (Razorpay)
// ============================================================
app.get('/api/payment/razorpay-key', (req, res) => {
  res.json({ key_id: process.env.RAZORPAY_KEY_ID });
});

app.post('/api/payment/create-order', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const error = validateAmount(amount);
    if (error) return res.status(400).json({ error });

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      orderId: order.id,
      amount,
      currency: 'INR',
      userId: req.user.id,
      status: 'pending',
    });
    await payment.save();

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payment/verify', verifyToken, async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${order_id}|${payment_id}`);
    const expectedSignature = shasum.digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const payment = await Payment.findOne({ orderId: order_id });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    payment.paymentId = payment_id;
    payment.signature = signature;
    payment.status = 'paid';
    await payment.save();

    const user = await User.findById(payment.userId);
    user.wallet = (user.wallet || 0) + payment.amount;
    await user.save();

    const tx = new Transaction({
      type: 'deposit_company',
      from: 'razorpay',
      to: user.email,
      amount: payment.amount,
      fee: 0,
      recipientAmount: payment.amount,
    });
    await tx.save();

    res.json({ success: true, message: 'Payment verified and wallet credited' });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// COMPANY ROUTES
// ============================================================
app.get('/api/company/wallet', async (req, res) => {
  try {
    const admin = await User.findOne({ isAdmin: true });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ balance: admin.wallet || 0 });
  } catch (err) {
    console.error('Company wallet error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/company/deposit', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const error = validateAmount(amount);
    if (error) return res.status(400).json({ error });

    const user = await User.findById(req.user.id);
    const admin = await User.findOne({ isAdmin: true });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    if ((user.wallet || 0) < amount) return res.status(400).json({ error: 'Insufficient balance' });

    user.wallet = (user.wallet || 0) - amount;
    admin.wallet = (admin.wallet || 0) + amount;
    await user.save();
    await admin.save();

    const tx = new Transaction({
      type: 'deposit_company',
      from: user.email,
      to: admin.email,
      amount,
      fee: 0,
      recipientAmount: amount,
    });
    await tx.save();

    res.json({ message: 'Deposit successful', balance: user.wallet, companyBalance: admin.wallet });
  } catch (err) {
    console.error('Company deposit error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ADMIN ROUTES
// ============================================================
app.get('/api/admin/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'open' });
    const totalTransactions = await Transaction.countDocuments();
    const totalBrokerage = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$fee' } } },
    ]);
    res.json({
      totalUsers,
      totalJobs,
      openJobs,
      totalTransactions,
      totalBrokerage: totalBrokerage[0]?.total || 0,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/brokerage', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$fee' } } },
    ]);
    res.json({ totalBrokerage: result[0]?.total || 0 });
  } catch (err) {
    console.error('Brokerage error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// CONTACT ROUTES (Admin only)
// ============================================================
let contactInfo = { email: 'support@lionlance.com', instagram: '@lionlance' };

app.get('/api/contact', (req, res) => {
  res.json(contactInfo);
});

app.put('/api/admin/contact', verifyToken, isAdmin, (req, res) => {
  const { email, instagram } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  contactInfo = { email, instagram };
  res.json({ message: 'Contact info updated', contact: contactInfo });
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection:', reason);
  process.exit(1);
});
