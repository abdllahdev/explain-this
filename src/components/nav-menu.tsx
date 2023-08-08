import { Github } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import ThemeToggle from "./theme-toggle";

export default function NavMenu() {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex h-10 items-center space-x-1 rounded-md border px-3 text-sm">
        <h1 className="font-black">Explain-This</h1>
        <span>
          {"("}by{" "}
          <Link
            className="text-sky-600 underline-offset-2 hover:underline"
            target="_blank"
            href="https://github.com/abdllahdev"
          >
            @abdllahdev
          </Link>
          {")"}
        </span>
      </div>
      <Link
        href="https://github.com/abdllahdev/explain-this.git"
        target="_blank"
        className={buttonVariants({ variant: "outline", size: "icon" })}
      >
        <Github size={20} />
      </Link>
      <ThemeToggle />
    </div>
  );
}
