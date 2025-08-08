import { Link } from "react-router-dom";
import { useEffect } from "react";

const Landing = () => {
  useEffect(() => {
    const title = "Pinocchio Voice Translator — Shrek 3 Style";
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
      return m;
    })();
    metaDesc.setAttribute("content", "Get started with the classy Pinocchio Voice Translator. Speak and hear witty Shrek 3-style replies in real time.");

    const canonical = document.querySelector('link[rel="canonical"]') || (() => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      document.head.appendChild(l);
      return l;
    })();
    canonical.setAttribute("href", window.location.origin + "/");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="container mx-auto px-4">
        <div className="glass rounded-3xl p-8 md:p-12 text-center animate-enter max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Pinocchio Voice Translator</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">Shrek 3 Interrogation Style</p>
          </header>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            A classy, playful way to turn your words into gloriously evasive Pinocchio responses. Supports English & Malayalam.
          </p>
          <div className="mt-8">
            <Link to="/app" className="inline-block">
              <button className="btn btn-primary hover-scale px-6 py-3 rounded-full">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
