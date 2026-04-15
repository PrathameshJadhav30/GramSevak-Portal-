import { Link } from "react-router-dom";

import Button from "../components/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 text-center">
      <h1 className="text-4xl font-bold text-slate-800">404</h1>
      <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="mt-4">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
