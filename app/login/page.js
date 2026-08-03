"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Loader, Toast } from "@/components/ui";
import { API_BASE, setSession } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        const message =
          data.message || data.errors?.[0]?.msg || "Something went wrong.";
        throw new Error(message);
      }

      if (mode === "login") {
        setSession(data.token, data.user);
        showToast("Login successful. Redirecting...", "success");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        showToast("Account created. Please log in.", "success");
        setMode("login");
      }
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-2">
        {mode === "login" ? "Login" : "Create Account"}
      </h1>
      <p className="mb-6 text-gray-600">
        {mode === "login"
          ? "Login to access the ArtisanKala platform."
          : "Register to start using ArtisanKala."}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "register" && (
          <Input
            label="Name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange("name")}
          />
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={handleChange("password")}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </Button>
      </form>

      {loading && (
        <div className="mt-6">
          <Loader />
        </div>
      )}

      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-4 text-blue-600 underline text-sm"
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </button>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}