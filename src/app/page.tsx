"use client";

import { useCallback, useEffect, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import type { ViewUpdate } from "@codemirror/view";
import initSwc, { parse } from "@swc/wasm-web";
import { githubDarkInit } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";

import NavMenu from "@/components/nav-menu";

export default function Home() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function runSwcOnMount() {
      await initSwc();
      setInitialized(true);
    }

    runSwcOnMount();
  }, []);

  const handleOnChange = useCallback(
    async (value: string, viewUpdate: ViewUpdate) => {
      if (initialized) {
        const result = await parse(value, {
          syntax: "typescript",
        });
        console.log(result);
      }
    },
    [initialized]
  );

  return (
    <section className="flex flex-1 overflow-hidden">
      <CodeMirror
        className="w-1/3 text-base"
        theme={githubDarkInit({
          settings: {
            background: "#09090b",
            foreground: "#fafafa",
            gutterBackground: "#09090b",
            gutterForeground: "#fafafa",
            lineHighlight: "#27272a80",
            selection: "#0369a180",
            selectionMatch: "#0369a180",
          },
        })}
        onChange={handleOnChange}
        extensions={[javascript({ jsx: true, typescript: true })]}
        height="100%"
      />
      <div className="relative flex w-2/3 items-center justify-center">
        <div className="absolute right-4 top-4 z-50">
          <NavMenu />
        </div>
      </div>
    </section>
  );
}
