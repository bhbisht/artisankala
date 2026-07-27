"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser, clearSession } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (getToken()) {
      setUser(getUser());
    }
  }, []);

  const handleLogout = () => {
    clearSession();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex flex-wrap items-center justify-between gap-3">
      <a href="/" className="font-bold">ArtisanKala</a>

      <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/ai">AI Generator</a>

        {user ? (
          <>
            <a href="/dashboard">Dashboard</a>
            <a href="/products/manage">Manage Products</a>
            <span className="hidden sm:inline text-blue-100">Hi, {user.name || user.email}</span>
            <button onClick={handleLogout} className="underline">
              Logout
            </button>
          </>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
    </nav>
  );
}