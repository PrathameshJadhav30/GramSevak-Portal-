import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { authApi } from "../services/api";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.name) next.name = "Name is required";
    if (!form.email) next.email = "Email is required";
    if (!form.password || form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (!form.mobile) next.mobile = "Mobile is required";
    if (!form.address) next.address = "Address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await authApi.register(form);
      toast.success("Registration successful. Please login.");
      navigate("/login", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="mb-4 text-2xl font-bold text-slate-800">{t("register")}</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
        <InputField
          id="name"
          label={t("name")}
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
        <InputField
          id="email"
          label={t("email")}
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        />
        <div className="relative sm:col-span-2">
          <InputField
            id="password"
            label={t("password")}
            type={showPassword ? "text" : "password"}
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
          <button
            type="button"
            className="absolute right-3 top-9 cursor-pointer text-slate-500"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <InputField
          id="mobile"
          label={t("mobile")}
          value={form.mobile}
          error={errors.mobile}
          onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))}
        />
        <InputField
          id="address"
          label={t("address")}
          value={form.address}
          error={errors.address}
          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
        />

        <div className="sm:col-span-2">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("loading") : t("register")}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
          {t("login")}
        </Link>
      </p>
    </AuthLayout>
  );
}
