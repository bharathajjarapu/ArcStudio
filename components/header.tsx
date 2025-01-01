import { CreateDialog } from "@/components/create"
import { SettingsDialog } from "@/components/settings"
import { Search } from "@/components/search"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings } from 'lucide-react'
import { ArchiveDialog } from "@/components/archive"
import { Dancing_Script } from 'next/font/google'

const dancingScript = Dancing_Script({ subsets: ['latin'] })

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className={`text-xl font-bold text-foreground ${dancingScript.className}`}>
            Arc Studio 🪄
          </span>
        </Link>
        
        <div className="flex-1 mx-4 hidden md:block">
            <Search />
          </div>
        
        <div className="flex items-center space-x-4">
          <ArchiveDialog />
          <SettingsDialog>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-foreground" />
            </Button>
          </SettingsDialog>
          <div className="">
          <CreateDialog />
          </div>
        </div>
      </div>
    </header>
  )
}

