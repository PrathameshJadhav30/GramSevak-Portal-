export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${className}`}>
      {children}
    </div>
  );
}
