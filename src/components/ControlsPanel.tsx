import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface ControlsProps {
  confusion: "mild" | "medium" | "maximum" | "shrek3";
  onConfusion: (c: ControlsProps["confusion"]) => void;
  languageMode: "auto" | "en" | "ml";
  onLanguageMode: (l: ControlsProps["languageMode"]) => void;
  rate: number;
  onRate: (r: number) => void;
  onMic: () => void;
  onSpeak: () => void;
  onClear: () => void;
  onSave: () => void;
  micActive: boolean;
}

const ControlsPanel = (props: ControlsProps) => {
  return (
    <section aria-label="Controls" className="container mx-auto px-4">
      <div className="glass rounded-2xl p-4 md:p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="confusion">Confusion level</Label>
            <Select value={props.confusion} onValueChange={(v) => props.onConfusion(v as any)}>
              <SelectTrigger id="confusion" aria-label="Confusion level">
                <SelectValue placeholder="Choose level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="maximum">Maximum</SelectItem>
                <SelectItem value="shrek3">Shrek 3 Mode</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={props.languageMode} onValueChange={(v) => props.onLanguageMode(v as any)}>
              <SelectTrigger id="language" aria-label="Language mode">
                <SelectValue placeholder="Auto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ml">Malayalam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="rate">Voice speed</Label>
            <div className="pt-3 pb-1">
              <Slider id="rate" value={[props.rate]} min={0.6} max={1.6} step={0.1} onValueChange={(v) => props.onRate(v[0])} aria-label="Voice speed slider" />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={props.micActive ? "destructive" : "default"} onClick={props.onMic} aria-pressed={props.micActive} aria-label="Toggle microphone">
                    {props.micActive ? "Stop" : "Listen"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Use your microphone</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="secondary" onClick={props.onSpeak} aria-label="Speak response">Speak</Button>
            <Button variant="secondary" onClick={props.onSave} aria-label="Save chat">Save</Button>
            <Button variant="outline" onClick={props.onClear} aria-label="Clear chat">Clear</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ControlsPanel;
