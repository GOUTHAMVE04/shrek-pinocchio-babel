import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="glass rounded-2xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "var(--shadow-glow) inset" }} />
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gradient">
            Pinocchio Voice Translator
          </h1>
          <p className="mt-3 md:mt-4 text-muted-foreground max-w-2xl">
            Shrek 3 Interrogation Style — Type or speak and get delightfully evasive Pinocchio replies.
          </p>
          <div className="mt-5 flex gap-3">
            <Button asChild variant="default" className="hover-scale" aria-label="Learn more">
              <a href="#app" className="story-link">Start Translating</a>
            </Button>
            <Button variant="secondary" className="hover-scale" aria-label="Docs link">
              <a href="#how-it-works" className="story-link">How it works</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
