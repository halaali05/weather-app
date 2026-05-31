"use client";

import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: new Date(),
      });
      await sendEmailVerification(userCredential.user);
      router.push("/verify-email");
    } catch (err) {
      const error = err as { code: string };
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered");
      } else if (error.code === "auth/weak-password") {
        setError("Password must be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h2>Join Us!</h2>
          <p>Already have an account?</p>
          <button className="btn-outline" onClick={() => router.push("/login")}>Login</button>
        </div>
        <div className="auth-right">
          <h1>Register</h1>
          <div className="input-group">
            <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn-primary" onClick={handleRegister}>Register</button>
        </div>
      </div>
    </div>
  );
}