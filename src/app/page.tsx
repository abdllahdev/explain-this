"use client";

import { useCallback, useEffect, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import type { ViewUpdate } from "@codemirror/view";
import initSwc, { parse } from "@swc/wasm-web";
import { githubDarkInit } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";

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
            background: "#171717",
            gutterBackground: "#171717",
            lineHighlight: "#404040a9",
            selection: "#247bb9",
            selectionMatch: "#247bb9",
          },
        })}
        onChange={handleOnChange}
        extensions={[javascript({ jsx: true, typescript: true })]}
        height="100%"
      />
      <div className="flex w-2/3 items-center justify-center bg-neutral-100"></div>
    </section>
  );
}
