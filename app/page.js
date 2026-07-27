"use client";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Loader from "../components/ui/Loader";
import Toast from "../components/ui/Toast";
import { API_BASE } from "../lib/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products.");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => {
        console.error(err);
        setToast({ show: true, message: err.message, type: "error" });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <Hero />

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader />
        </div>
      ) : products.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          No products listed yet — check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-8">
          {products.map((product) => (
            <Card
              key={product.id}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <Footer />
    </>
  );
}