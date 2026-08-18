import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const SiteContext = createContext({
  settings: null,
  pages: {},
});

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
  const [pages, setPages] = useState({});
const refresh = async () => {
  try {
    const settingsRes = await api.get("/settings");
    const homeRes = await api.get("/pages/home");

    setSettings({
      ...FALLBACK,
      ...settingsRes.data
    });

    setPages({
      home: homeRes.data
    });

  } catch (error) {
    console.log(error);
  }
};
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SiteContext.Provider value={{ settings, pages, refresh }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
