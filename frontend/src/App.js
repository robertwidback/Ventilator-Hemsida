import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "@/App.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import OmOss from "@/pages/OmOss";
import Tjanster from "@/pages/Tjanster";
import Referenser from "@/pages/Referenser";
import Nyheter from "@/pages/Nyheter";
import NyhetDetail from "@/pages/NyhetDetail";
import Admin from "@/pages/Admin";
import Hallbarhet from "@/pages/Hallbarhet";
import Kontakt from "@/pages/Kontakt";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/om-oss" element={<OmOss />} />
            <Route path="/tjanster" element={<Tjanster />} />
            <Route path="/referenser" element={<Referenser />} />
            <Route path="/nyheter" element={<Nyheter />} />
            <Route path="/nyheter/:id" element={<NyhetDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/hallbarhet" element={<Hallbarhet />} />
            <Route path="/kontakt" element={<Kontakt />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="bottom-center" richColors />
    </BrowserRouter>
  );
}

export default App;
