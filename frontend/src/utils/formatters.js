export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const statusBadgeClass = (status) => {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    done: "bg-teal-100 text-teal-800",
    rejected: "bg-rose-100 text-rose-800",
    open: "bg-sky-100 text-sky-800",
    in_progress: "bg-indigo-100 text-indigo-800",
    resolved: "bg-emerald-100 text-emerald-800",
  };
  return map[status] || "bg-slate-100 text-slate-700";
};
