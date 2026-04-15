import { useTranslation } from "react-i18next";

import Button from "./Button";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const setLang = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={i18n.language === "en" ? "primary" : "secondary"}
        className="px-3 py-1"
        onClick={() => setLang("en")}
      >
        EN
      </Button>
      <Button
        variant={i18n.language === "mr" ? "primary" : "secondary"}
        className="px-3 py-1"
        onClick={() => setLang("mr")}
      >
        मराठी
      </Button>
    </div>
  );
}
