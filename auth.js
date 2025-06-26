// API Base URL - Replace with your actual backend URL
const API_BASE_URL = "http://localhost:3000/api"

// Utility Functions
function showMessage(message, type = "success") {
  const messageContainer = document.getElementById("messageContainer")
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${type}`
  messageDiv.textContent = message

  messageContainer.appendChild(messageDiv)

  setTimeout(() => {
    messageDiv.remove()
  }, 5000)
}

function togglePassword() {
  const passwordInput = document.getElementById("password")
  const passwordIcon = document.getElementById("passwordIcon")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    passwordIcon.className = "fas fa-eye-slash"
  } else {
    passwordInput.type = "password"
    passwordIcon.className = "fas fa-eye"
  }
}

function toggleSignupPassword() {
  const passwordInput = document.getElementById("signupPassword")
  const passwordIcon = document.getElementById("signupPasswordIcon")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    passwordIcon.className = "fas fa-eye-slash"
  } else {
    passwordInput.type = "password"
    passwordIcon.className = "fas fa-eye"
  }
}

// Authentication Functions
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("currentUser", JSON.stringify(data.user))
      showMessage("Login successful!", "success")
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)
    } else {
      showMessage(data.message || "Login failed", "error")
    }
  } catch (error) {
    console.error("Login error:", error)
    showMessage("Network error. Please try again.", "error")
  }
}

async function signup(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (response.ok) {
      showMessage("Account created successfully! Please log in.", "success")
      setTimeout(() => {
        window.location.href = "login.html"
      }, 2000)
    } else {
      showMessage(data.message || "Signup failed", "error")
    }
  } catch (error) {
    console.error("Signup error:", error)
    showMessage("Network error. Please try again.", "error")
  }
}

function logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("currentUser")
  showMessage("Logged out successfully!", "success")
  setTimeout(() => {
    window.location.href = "login.html"
  }, 1000)
}

// Form Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Login Form
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      if (!email || !password) {
        showMessage("Please fill in all fields", "error")
        return
      }

      login(email, password)
    })
  }

  // Signup Form
  const signupForm = document.getElementById("signupForm")
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const fullName = document.getElementById("fullName").value
      const email = document.getElementById("signupEmail").value
      const password = document.getElementById("signupPassword").value
      const confirmPassword = document.getElementById("confirmPassword").value
      const terms = document.getElementById("terms").checked

      if (!fullName || !email || !password || !confirmPassword) {
        showMessage("Please fill in all fields", "error")
        return
      }

      if (password !== confirmPassword) {
        showMessage("Passwords do not match", "error")
        return
      }

      if (password.length < 6) {
        showMessage("Password must be at least 6 characters long", "error")
        return
      }

      if (!terms) {
        showMessage("Please accept the terms and conditions", "error")
        return
      }

      signup({ fullName, email, password })
    })
  }

  // Check authentication on protected pages
  const currentPage = window.location.pathname.split("/").pop()
  if (currentPage === "index.html") {
    const token = localStorage.getItem("authToken")
    if (!token) {
      window.location.href = "login.html"
    }
  }
})
