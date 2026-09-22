import { useEffect, useState } from "react";
import { Cookie } from "@phosphor-icons/react";
import { Button } from "../ui/Button";

const STORAGE_KEY = "updatebase-cookie-consent";

type Consent = "accepted" | "essential-only";

export function CookieConsent() {
  const [visible, setVisible] = useState(() => !window.localStorage.getItem(STORAGE_KEY));
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    const openPreferences = () => {
      setVisible(true);
      setManaging(true);
    };
    document.getElementById("footer-cookie-preferences")?.addEventListener("click", openPreferences);
    return () =>
      document
        .getElementById("footer-cookie-preferences")
        ?.removeEventListener("click", openPreferences);
  }, []);

  const save = (consent: Consent) => {
    window.localStorage.setItem(STORAGE_KEY, consent);
    setVisible(false);
    setManaging(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="cookie preferences"
      className="fixed inset-x-0 bottom-0 z-[60] p-md md:p-lg"
    >
      <div className="container-page">
        <div className="mx-auto flex max-w-2xl flex-col gap-md rounded-xl border border-hairline bg-paper p-lg shadow-card">
          <div className="flex items-start gap-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-cloud text-ink">
              <Cookie size={18} />
            </span>
            <div>
              <p className="font-body text-body-md font-medium text-ink">we use cookies</p>
              <p className="mt-xxs font-body text-body-sm text-ink-soft">
                we use cookies to keep you signed in and understand how updatebase is used. you can
                accept all cookies or manage your preferences.
              </p>
            </div>
          </div>

          {managing && (
            <div className="flex items-center justify-between rounded-lg border border-hairline bg-cloud px-md py-sm">
              <div>
                <p className="font-body text-body-sm font-medium text-ink">analytics cookies</p>
                <p className="font-body text-body-sm text-ink-soft">helps us improve updatebase</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={analytics}
                onClick={() => setAnalytics((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-pill transition-colors duration-fast ease-standard cursor-pointer ${
                  analytics ? "bg-cta" : "bg-hairline"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-pill bg-paper transition-transform duration-fast ease-standard ${
                    analytics ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          )}

          <div className="flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
            {!managing && (
              <Button variant="secondary" size="md" onClick={() => setManaging(true)}>
                manage preferences
              </Button>
            )}
            <Button
              size="md"
              onClick={() => save(managing && !analytics ? "essential-only" : "accepted")}
            >
              {managing ? "save preferences" : "accept all"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
