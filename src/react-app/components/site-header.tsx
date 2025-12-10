import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { IconCommand, IconSearch } from "@tabler/icons-react";

export function SiteHeader() {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            {/* Command Palette Trigger */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 text-muted-foreground"
              onClick={() => setCommandOpen(true)}
            >
              <IconSearch className="h-4 w-4" />
              <span className="hidden lg:inline-flex">Search...</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:inline-flex">
                <IconCommand className="h-3 w-3" />K
              </kbd>
            </Button>
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setCommandOpen(true)}
            >
              <IconSearch className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
              <a
                href="https://github.com/yoinks-yoinks/tm"
                rel="noopener noreferrer"
                target="_blank"
                className="dark:text-foreground"
              >
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
