import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const SiteContext = createContext({ settings: null });

const FALLBACK = {
  brand_name: "Apexora Studio",
  logo_text: "Apexora",
  email: "hello@apexora.studio",
  nav: [
    { label: "Work", path: "/portfolio" },
    { label: "Services", path: "/services" },
    { label: "Studio", path: "/about" },
    { label: "Journal", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ],
  socials: {},
};

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK);

  const refresh = () => {
    api
      .get("/settings")
      .then((res) => setSettings({ ...FALLBACK, ...res.data }))
      .catch(() => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SiteContext.Provider value={{ settings, refresh }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
