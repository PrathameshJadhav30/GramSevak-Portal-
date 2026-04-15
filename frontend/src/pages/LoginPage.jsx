import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { authApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.email) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { data } = await authApi.login(form);
      login(data.data.token, data.data.user);
      toast.success("Login successful");
      const to = location.state?.from?.pathname || "/dashboard";
      navigate(to, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="mb-4 text-2xl font-bold text-slate-800">{t("login")}</h2>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <InputField
          id="email"
          label={t("email")}
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />

        <div className="relative">
          <InputField
            id="password"
            label={t("password")}
            type={showPassword ? "text" : "password"}
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <button
            type="button"
            className="absolute right-3 top-9 cursor-pointer text-slate-500"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? t("loading") : t("login")}
        </Button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        New villager?{" "}
        <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
          {t("register")}
        </Link>
      </p>
    </AuthLayout>
  );
}
