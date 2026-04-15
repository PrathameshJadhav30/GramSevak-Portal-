import { Landmark } from "lucide-react";

import LanguageToggle from "../components/LanguageToggle";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row lg:items-stretch">
        <section className="rounded-2xl bg-gradient-to-br from-emerald-800 to-sky-800 p-6 text-white shadow-lg lg:w-2/5">
          <div className="mb-4 flex items-center gap-2">
            <Landmark size={26} />
            <h1 className="text-xl font-semibold">Gram Panchayat Portal</h1>
          </div>
          <p className="text-sm text-emerald-50">
            Digital governance services for citizens with secure, transparent and easy access.
          </p>
          <div className="mt-6 rounded-lg bg-white/10 p-4 text-sm">
            Mobile friendly, fast, and available in English and Marathi.
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-lg lg:w-3/5">
          <div className="mb-6 flex justify-end">
            <LanguageToggle />
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
