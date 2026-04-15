export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-md hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-emerald-300",
    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:shadow-sm hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-slate-300",
    danger:
      "bg-rose-700 text-white hover:bg-rose-800 hover:shadow-md hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-rose-300",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
