import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config"; 

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
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

  
  const handleSignUp = async (e) => {
    e.preventDefault(); 

    setLoading(true); 
    setError(""); 

    try {
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser , {
        displayName:name
      })
      console.log(
        userCredential.user
      );

      
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.message);
      
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak (at least 6 characters).");
      } else {
        setError(
          err.message || "Failed to create an account. Please try again."
        );
      }
    } finally {
      setLoading(false); 
    }
  };

  
  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider(); 
      await signInWithPopup(auth, provider); 
      navigate("/"); 
    } catch (err) {
      console.error("Google sign-up error:", err.message);
      setError(
        err.message || "Failed to sign up with Google. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Sign Up</h1>
      <form onSubmit={handleSignUp} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Name:</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Name"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {error && <p style={styles.errorText}>{error}</p>}

        <p style={styles.linkText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </form>

      <div style={styles.separator}>OR</div>
      <button
        onClick={handleGoogleSignUp}
        disabled={loading}
        style={{ ...styles.button, ...styles.googleButton }}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          style={styles.googleIcon}
        />
        {loading ? "Signing up with Google..." : "Sign up with Google"}
      </button>
    </div>
  );
}


