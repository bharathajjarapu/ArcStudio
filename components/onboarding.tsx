"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageParameters } from "@/types/image"
import { MODELS } from "@/lib/constants"

interface UserSettings extends ImageParameters {
  username: string
}

export function OnboardingFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<UserSettings>({
    username: "",
    model: "flux",
    private: false,
    nologo: false,
    enhance: false,
    safe: true,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("user-settings");
    if (!savedSettings) {
      setOpen(true);
    } else {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem("user-settings", JSON.stringify(settings));
    setOpen(false);
    setStep(1);
    window.dispatchEvent(new Event('user-settings-updated'));
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      saveSettings();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[380px] bg-background border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">Arc Studio</DialogTitle>
          <DialogDescription className="text-zinc-400">
           
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {step === 1 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right text-white">
                Username
              </Label>
              <Input
                id="username"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                className="col-span-3 bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right text-white">
                  Img Model
                </Label>
                <Select
                  value={settings.model}
                  onValueChange={(value) => setSettings({ ...settings, model: value })}
                >
                  <SelectTrigger className="col-span-3 bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {MODELS.map((model) => (
                      <SelectItem key={model} value={model} className="text-white">
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="private" className="text-white">Private</Label>
                <Switch
                  id="private"
                  checked={settings.private}
                  onCheckedChange={(checked) => setSettings({ ...settings, private: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="nologo" className="text-white">No logo</Label>
                <Switch
                  id="nologo"
                  checked={settings.nologo}
                  onCheckedChange={(checked) => setSettings({ ...settings, nologo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enhance" className="text-white">Enhance prompt</Label>
                <Switch
                  id="enhance"
                  checked={settings.enhance}
                  onCheckedChange={(checked) => setSettings({ ...settings, enhance: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="safe" className="text-white">Safe mode</Label>
                <Switch
                  id="safe"
                  checked={settings.safe}
                  onCheckedChange={(checked) => setSettings({ ...settings, safe: checked })}
                />
              </div>
            </>
          )}
        </div>
        <Button onClick={handleNext} className="bg-primary text-primary-foreground">
          {step === 1 ? "Next" : "Start your journey"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

