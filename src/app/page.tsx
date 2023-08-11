"use client";

import { useCallback, useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { javascript } from "@codemirror/lang-javascript";
import type { ViewUpdate } from "@codemirror/view";
import initSwc, { type ModuleItem, parse } from "@swc/wasm-web";
import { githubDarkInit } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";

import FlowGraph from "@/components/flow-graph";
import Loader from "@/components/loader";
import NavMenu from "@/components/nav-menu";

export default function Home() {
  const initValue = `function printHelloWorld(name, msg) {
  console.log(\`Hello, World \${name}\`);

  function print(msg) {
    console.log(msg)
  }
}
`;
  const [initialized, setInitialized] = useState(false);
  const [ast, setAst] = useState<ModuleItem[]>();

  const parseCode = useCallback(
    async (value: string) => {
      if (initialized) {
        const result = await parse(value, {
          syntax: "ecmascript",
        });
        console.log(result.body);
        setAst(result.body);
      }
    },
    [initialized]
  );

  useEffect(() => {
    async function runSwcOnMount() {
      await initSwc();
      await parseCode(initValue);
      setInitialized(true);
    }

    runSwcOnMount();
  }, [initValue, parseCode]);

  const handleOnChange = async (value: string, viewUpdate: ViewUpdate) => {
    parseCode(value);
  };

  return (
    <>
      {initialized ? (
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
            value={initValue}
          />
          <div className="relative flex w-2/3 items-center justify-center">
            <div className="absolute right-4 top-4 z-50">
              <NavMenu />
            </div>
            <ReactFlowProvider>
              {ast ? <FlowGraph ast={ast} /> : <Loader />}
            </ReactFlowProvider>
          </div>
        </section>
      ) : (
        <Loader title="Explain-This" />
      )}
    </>
  );
}
