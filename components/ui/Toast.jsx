"use client";

import { useEffect } from "react";

export default function Toast({
  message,
  show,
  onClose,
  type = "success",
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";

  return (
    <div className={`fixed top-5 right-5 ${bgColor} text-white px-4 py-2 rounded`}>
      {message}
    </div>
  );
}