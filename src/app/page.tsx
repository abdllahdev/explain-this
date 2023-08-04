"use client";

import { useState, useEffect, useCallback } from "react";
import initSwc, { parse } from "@swc/wasm-web";
import type { ViewUpdate } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { githubDarkInit } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";

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
    [initialized],
  );

  return (
    <section className="flex-1 flex overflow-hidden">
      <CodeMirror
        className="w-1/2 text-base"
        theme={githubDarkInit({
          settings: {
            background: "#0f172a",
            foreground: "#cbd5e1",
            gutterBackground: "#0f172a",
            gutterForeground: "#cbd5e1",
            lineHighlight: "#1e293bb3",
            selection: "#075985",
            selectionMatch: "#075985",
          },
        })}
        onChange={handleOnChange}
        extensions={[javascript({ jsx: true, typescript: true })]}
        height="100%"
      />
      <div className="w-1/2 overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"></div>
    </section>
  );
}
