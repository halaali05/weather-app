"use client";

import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
    setError("Please enter email and password");
    return;
  }
    try {
     
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setError("No account found with this email");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setError("Please verify your email first");
        return;
      }
      router.push("/");
    } catch (err) {
      const error = err as { code: string };
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        setError("Wrong password");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        console.log(err);
        setError("Something went wrong");
      }
    }
  };

  const handleGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
  
    const q = query(collection(db, "users"), where("email", "==", userCredential.user.email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: userCredential.user.displayName,
        email: userCredential.user.email,
        createdAt: new Date(),
      });
    }
    router.push("/");
  } catch (_) {
    setError("Something went wrong");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h2>Hello, Welcome!</h2>
          <p>Don&apos;t have an account?</p>
          <button className="btn-outline" onClick={() => router.push("/register")}>Register</button>
        </div>
        <div className="auth-right">
          <h1>Login</h1>
          <div className="input-group">
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn-primary" onClick={handleLogin}>Login</button>
          <div className="divider">or</div>
          <button className="btn-google" onClick={handleGoogle}>
            <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="Google" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}