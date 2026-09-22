import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { CookieConsent } from "./components/layout/CookieConsent";
import { useLenis } from "./hooks/useLenis";

const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })));
const Privacy = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.Privacy })));

function App() {
  useLenis();

  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Suspense>
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;
