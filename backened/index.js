import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 5000;

// 🛠️ MIDDLEWARE – must come first
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔌 MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/contact_form', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 📦 Schema + Model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model('Contact', contactSchema);

// 🚀 Single POST route — after parsers
app.post('/api/contact', async (req, res) => {
  console.log('Received body:', req.body);
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    await new Contact({ name, email, message }).save();
    return res.status(200).json({ message: "Message received successfully!" });
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
});

// 🎯 Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
