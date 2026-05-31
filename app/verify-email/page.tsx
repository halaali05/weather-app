"use client";

import { auth } from "../lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";


export default function VerifyEmailPage() {
  const [sent, setSent] = useState(false);
 

  const resend = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      setSent(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h2>Almost There!</h2>
          <p>Check your inbox and verify your email to continue.</p>
        </div>
        <div className="auth-right">
          <h1>Verify Email</h1>
          <p style={{color: "#666", marginBottom: "24px", textAlign: "center"}}>
            We sent a verification link to your email. Please check your inbox and click the link.
          </p>
          <button className="btn-primary" onClick={resend}>Resend Email</button>
          {sent && <p style={{color: "green", textAlign: "center", marginTop: "12px"}}>Email sent! ✅</p>}
          <div className="link-text">
            Already verified? <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}