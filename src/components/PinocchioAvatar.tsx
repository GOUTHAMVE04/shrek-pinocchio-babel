import { useEffect, useState } from "react";

const PinocchioAvatar = () => {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const onStart = () => setSpeaking(true);
    const onEnd = () => setSpeaking(false);
    window.addEventListener("pinocchio:speechstart", onStart as any);
    window.addEventListener("pinocchio:speechend", onEnd as any);
    return () => {
      window.removeEventListener("pinocchio:speechstart", onStart as any);
      window.removeEventListener("pinocchio:speechend", onEnd as any);
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="glass rounded-2xl p-4 inline-flex items-center gap-4">
        <svg width="120" height="80" viewBox="0 0 120 80" role="img" aria-label="Pinocchio avatar">
          {/* Head */}
          <circle cx="40" cy="40" r="28" fill="hsl(var(--accent))" />
          {/* Eye */}
          <circle cx="35" cy="35" r="3" fill="hsl(var(--accent-foreground))" />
          <circle cx="47" cy="35" r="3" fill="hsl(var(--accent-foreground))" />
          {/* Nose base */}
          <rect x="55" y="38" width="4" height="4" fill="hsl(var(--accent-foreground))" />
          {/* Nose length */}
          <rect x="59" y="39" height="2" rx="1" ry="1"
            width={speaking ? 18 : 42}
            fill="hsl(var(--primary))"
            style={{ transition: "var(--transition-smooth)" }}
          />
        </svg>
        <div className="text-xs text-muted-foreground">
          {speaking ? "Speaking… nose shrinking" : "Idle"}
        </div>
      </div>
    </div>
  );
};

export default PinocchioAvatar;
