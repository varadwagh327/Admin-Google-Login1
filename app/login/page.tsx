"use client";

import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { login } from "../redux/authSlice";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement | null,
            options: Record<string, unknown>
          ) => void;
          prompt: () => void;
        };
      };
    };
    handleCredentialResponse?: (response: { credential: string }) => void;
  }
}

export default function LoginPage(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Google login setup
  useEffect(() => {
    window.handleCredentialResponse = async (response: { credential: string }) => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        });

        const data = await res.json();
        if (data?.token && data?.user) {
          dispatch(
            login({
              user: data.user.email, // backend should return { user: { email, name } }
              token: data.token,
            })
          );
          router.push("/HomePage");
        } else {
          console.error("Google login failed", data);
        }
      } catch (err) {
        console.error("Google login error:", err);
      }
    };

    const scriptId = "google-client-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGSI;
      document.body.appendChild(script);
    } else {
      initGSI();
    }

    function initGSI() {
      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
        "920952709114-4oqpubk25650h2vcoc9mh9s9cke419fu.apps.googleusercontent.com";

      if (window.google?.accounts?.id?.initialize && window.google?.accounts?.id?.renderButton) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: window.handleCredentialResponse!,
        });

        const container = document.getElementById("googleSignIn");
        window.google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          shape: "pill",
        });
      }
    }

    return () => {
      delete window.handleCredentialResponse;
    };
  }, [router, dispatch]);

  // Email/password login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data?.token && data?.user) {
        dispatch(
          login({
            user: data.user.email,
            token: data.token,
          })
        );
        router.push("/HomePage");
      } else {
        console.error("Login failed", data);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-6">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back 👋</h1>
          <p className="text-gray-600 mt-2">Login to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3"
          />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="flex justify-center">
          <div
            id="googleSignIn"
            className="flex items-center gap-2 border px-4 py-2 rounded-lg cursor-pointer bg-white shadow-sm"
          >
            <FcGoogle size={22} />
            <span className="text-sm font-medium text-gray-700">
              Sign in with Google
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
