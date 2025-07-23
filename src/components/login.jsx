import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"; 
import { auth } from "../firebase/config";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f4f7f6",
      padding: "20px",
      boxSizing: "border-box",
    },
    heading: {
      color: "#333",
      marginBottom: "30px",
    },
    form: {
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "8px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      minWidth: "300px",
      maxWidth: "400px",
      width: "100%",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
    },
    input: {
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px",
      marginTop: "5px",
    },
    button: {
      padding: "12px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    errorText: {
      color: "red",
      textAlign: "center",
      fontSize: "14px",
    },
    linkText: {
      textAlign: "center",
      fontSize: "14px",
      color: "#555",
    },
    link: {
      color: "#007bff",
      textDecoration: "none",
    },
    separator: {
      
      margin: "20px 0",
      color: "#aaa",
      textAlign: "center",
      position: "relative",
      width: "100%",
      "&::before": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: 0,
        right: "55%",
        borderBottom: "1px solid #eee",
        transform: "translateY(-50%)",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        right: 0,
        left: "55%",
        borderBottom: "1px solid #eee",
        transform: "translateY(-50%)",
      },
    },
    googleButton: {
      backgroundColor: "#ffffffff", 
      color: "black",
      border: "2px solid black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "12px 20px",
    },
    googleIcon: {
      
      width: "20px",
      height: "20px",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
      
      if (
        err.code === "auth/invalid-email" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Failed to log in. Please try again.");
      } 
    } finally {
      setLoading(false);
    }
  };

  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider(); 
      await signInWithPopup(auth, provider); 
      
      navigate("/"); 
    } catch (err) {
      console.error("Google sign-in error:", err.message);
      setError(
        err.message || "Failed to sign in with Google. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Login Form</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="login-email">Email:</label>
          <input
            type="email"
            id="login-email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="login-password">Password:</label>
          <input
            type="password"
            id="login-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p style={styles.errorText}>{error}</p>}

        <p style={styles.linkText}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign Up
          </Link>
        </p>
      </form>

      <div style={styles.separator}>OR</div>
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{ ...styles.button, ...styles.googleButton }}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          style={styles.googleIcon}
        />
        {loading ? "Signing in with Google..." : "Sign in with Google"}
      </button>
    </div>
  );
}


