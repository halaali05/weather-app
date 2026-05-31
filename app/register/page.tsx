"use client";

import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
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
      await sendEmailVerification(userCredential.user);
      router.push("/verify-email");
    } catch (err) {
      setError((err as Error).message);
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