import { useState, useEffect } from "react";

export const useCookies = () => {
  const [hasConsent, setHasConsent] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [loading, setLoading] = useState(true);

  const API_BASE =
    process.env.REACT_APP_API_URL ||
    "https://greens.org.pl/backend.greens.org.pl/public/api";

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    try {
      console.log("Checking consent at:", `${API_BASE}/cookies/preferences`);

      const response = await fetch(`${API_BASE}/cookies/preferences`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);

        setHasConsent(data.has_consent);
        setPreferences(data.preferences);

        if (data.has_consent && data.preferences.analytics) {
          loadGoogleAnalytics();
        }
        if (data.has_consent && data.preferences.marketing) {
          loadMarketingScripts();
        }
      } else {
        console.error("Response not OK:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error checking cookie consent:", error);
      setHasConsent(false);
      setPreferences({
        necessary: true,
        analytics: false,
        marketing: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences) => {
    try {
      console.log("Saving preferences to:", `${API_BASE}/cookies/preferences`);

      const response = await fetch(`${API_BASE}/cookies/preferences`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPreferences),
      });

      console.log("Save response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Save response data:", data);

        if (data.success) {
          setHasConsent(true);
          setPreferences(newPreferences);

          if (newPreferences.analytics) {
            loadGoogleAnalytics();
          }
          if (newPreferences.marketing) {
            loadMarketingScripts();
          }

          return true;
        }
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
    return false;
  };

  const revokeConsent = async () => {
    try {
      console.log("Revoking consent at:", `${API_BASE}/cookies/consent`);

      const response = await fetch(`${API_BASE}/cookies/consent`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Revoke response status:", response.status);

      if (response.ok) {
        setHasConsent(false);
        setPreferences({
          necessary: true,
          analytics: false,
          marketing: false,
        });

        removeAnalyticsCookies();
        removeMarketingCookies();

        return true;
      }
    } catch (error) {
      console.error("Error revoking consent:", error);
    }
    return false;
  };

  const loadGoogleAnalytics = () => {
    if (typeof window.gtag !== "undefined") return;

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID";
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "GA_MEASUREMENT_ID");
    window.gtag = gtag;
  };

  const loadMarketingScripts = () => {
    console.log("Loading marketing scripts...");
  };

  const removeAnalyticsCookies = () => {
    const cookiesToRemove = ["_ga", "_ga_*", "_gid", "_gat"];
    cookiesToRemove.forEach((cookie) => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };

  const removeMarketingCookies = () => {
    const cookiesToRemove = ["_fbp", "_fbc"];
    cookiesToRemove.forEach((cookie) => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };

  return {
    hasConsent,
    preferences,
    loading,
    savePreferences,
    revokeConsent,
    checkConsent,
  };
};
