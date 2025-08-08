import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "pinocchio";
  text: string;
  ts: number;
}

export interface ChatPanelProps {
  messages: Message[];
  onSend: (text: string) => void;
  disabledUpload?: boolean;
  liveReply?: string;
}

const ChatPanel = ({ messages, onSend, disabledUpload, liveReply }: ChatPanelProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const doSend = () => {
    const v = inputRef.current?.value?.trim();
    if (!v) return;
    onSend(v);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      doSend();
    }
  };

  const copy = async (t: string) => {
    try { await navigator.clipboard.writeText(t); } catch {}
  };

  return (
    <main id="app" className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              <label htmlFor="message" className="text-sm font-medium">Your message</label>
              <Textarea id="message" ref={inputRef} placeholder="Ask a question or say something… (Ctrl/Cmd+Enter to send)" onKeyDown={onKey} aria-label="Message input" />
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Supports English & Malayalam</div>
                <div className="flex items-center gap-2">
                  <input type="file" accept="audio/*" aria-label="Upload audio for transcription" disabled={disabledUpload} onChange={() => { /* handled in parent later */ }} className="text-sm" />
                  <Button onClick={doSend} aria-label="Send message">Send</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-0 md:p-0">
            <div className="max-h-[60vh] overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-sm text-muted-foreground">No messages yet. Try asking “Where is the king?” and switch to Shrek 3 mode.</div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}> 
                  <div className={cn(
                    "rounded-2xl px-4 py-3 max-w-[80%] shadow-sm animate-fade-in",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                  )}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</div>
                    <Separator className="my-2 opacity-30" />
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                      <span>{new Date(m.ts).toLocaleTimeString()}</span>
                      <button onClick={() => copy(m.text)} className="underline story-link">Copy</button>
                    </div>
                  </div>
                </div>
              ))}
              {liveReply && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 max-w-[80%] shadow-sm animate-fade-in bg-accent text-accent-foreground">
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{liveReply}</div>
                    <div className="mt-1 text-[10px] opacity-70">live</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ChatPanel;
