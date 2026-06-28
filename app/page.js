"use client";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Loader from "../components/ui/Loader";
import Toast from "../components/ui/Toast";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setShowToast(true);
      });
  }, []);

  return (
    <>
      <Navbar />

      <Hero />

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
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
        message="Failed to load products!"
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <Footer />
    </>
  );
}