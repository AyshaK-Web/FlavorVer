"use client"

import * as React from "react"
import { Palette, Check } from "lucide-react"

import { usePalette } from "@/components/palette-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PaletteToggle() {
  const { setPalette, palette, palettes } = usePalette()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle palette</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {palettes.map((p) => (
          <DropdownMenuItem
            key={p.class}
            className="flex items-center justify-between"
            onClick={() => setPalette(p.class)}
          >
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{p.name}</span>
            </div>
            {palette === p.class && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
