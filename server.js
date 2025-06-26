require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'docs')))
app.use(express.static(path.join(__dirname)))

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err)
})

// User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Explicitly setting collection name as "data-train"
const User = mongoose.model("User", userSchema, "data-train")

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here"

// Routes

// Signup Route
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    await user.save()

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ message: "Server error during signup" })
  }
})

// Login Route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" })
    }
    req.user = user
    next()
  })
}

// Protected route example
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"))
})

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"))
})

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"))
})

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"))
})

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
