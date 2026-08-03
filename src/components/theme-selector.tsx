import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TermTranslationAdapter } from "@/intefaces/translation"

export const ThemeSelector = ({ termTranslation }: TermTranslationAdapter) => {
  const { setTheme } = useTheme()
  const dropdownMenuButton = (
    <Button
      className="border border-gray-600 dark:border-gray-400"
      variant="secondary"
      size="icon"
      title={termTranslation.toggleTheme}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{termTranslation.toggleTheme}</span>
    </Button>
  )
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={dropdownMenuButton} />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {termTranslation.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {termTranslation.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {termTranslation.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
