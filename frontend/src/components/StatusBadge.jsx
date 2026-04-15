import { statusBadgeClass } from "../utils/formatters";

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusBadgeClass(status)}`}>
      {status?.replace("_", " ")}
    </span>
  );
}
