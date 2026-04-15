export default function InputField({
  label,
  id,
  type = "text",
  error,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 ${
          error ? "border-rose-400" : "border-slate-300"
        } ${className}`}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
