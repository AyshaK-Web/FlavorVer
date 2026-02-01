"use client"

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react"
import { useTheme } from "next-themes";

export const palettes = [
  { name: "Warm Terracotta", class: "theme-warm-terracotta", color: "hsl(16, 70%, 62%)" },
  { name: "Forest", class: "theme-forest", color: "hsl(140, 45%, 45%)" },
  { name: "Ocean", class: "theme-ocean", color: "hsl(220, 60%, 60%)" },
  { name: "Dusk", class: "theme-dusk", color: "hsl(330, 70%, 65%)" },
];

type PaletteContextType = {
  palette: string
  setPalette: (palette: string) => void,
  palettes: typeof palettes
}

const PaletteContext = createContext<PaletteContextType | undefined>(undefined)

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState(palettes[0].class);
  const { theme: mode } = useTheme();

  useEffect(() => {
    const storedPalette = localStorage.getItem("ui-palette")
    if (storedPalette && palettes.some(p => p.class === storedPalette)) {
      setPaletteState(storedPalette)
    }
  }, [])
  
  const setPalette = (paletteClass: string) => {
    const newPalette = palettes.find(p => p.class === paletteClass);
    if (newPalette) {
        document.body.classList.remove(...palettes.map(p => p.class));
        document.body.classList.add(newPalette.class);
        localStorage.setItem("ui-palette", newPalette.class);
        setPaletteState(newPalette.class);
    }
  };

  // Ensure the theme class is applied on initial load and theme change
  useEffect(() => {
    document.body.classList.remove(...palettes.map(p => p.class));
    document.body.classList.add(palette);
  }, [palette, mode]);

  const value = useMemo(() => ({ palette, setPalette, palettes }), [palette])

  return (
    <PaletteContext.Provider value={value}>
      {children}
    </PaletteContext.Provider>
  )
}

export function usePalette() {
  const context = useContext(PaletteContext)
  if (context === undefined) {
    throw new Error("usePalette must be used within a PaletteProvider")
  }
  return context
}
