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
    <main className="grid grid-cols-2 h-screen max-h-screen">
      <div className="flex min-h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        <CodeMirror
          className="text-sm flex-1"
          theme={githubDarkInit({
            settings: {
              background: "#0f172a",
              gutterBackground: "#0f172a",
              lineHighlight: "#1e293b",
            },
          })}
          onChange={handleOnChange}
          extensions={[javascript({ jsx: true, typescript: true })]}
          minHeight="100%"
        />
      </div>
      <div className="bg-slate-900"></div>
    </main>
  );
}
