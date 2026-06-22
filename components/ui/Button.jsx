export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
}) {
  const variants = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-600 text-white",
    outline: "border border-gray-600 text-gray-700",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} rounded hover:opacity-80`}
    >
      {children}
    </button>
  );
}