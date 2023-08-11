"use client";

import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { FunctionDeclaration, Param } from "@swc/wasm-web";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default memo(function FunctionFlowNode(
  node: NodeProps<FunctionDeclaration>
) {
  const getParam = (param: Param) => {
    switch (param.pat.type) {
      case "Identifier":
        return {
          value: param.pat.value,
        };
      default:
        return {
          value: "",
        };
    }
  };

  return (
    <div className="flex items-start space-x-1 rounded-md border bg-background p-4 text-xs">
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger className="text-pink-500 underline-offset-2 hover:underline">
          function
        </HoverCardTrigger>
        <HoverCardContent>
          <p>
            The keyword{" "}
            <span className="font-black text-pink-500">`function`</span> is used
            to declare new functions.
          </p>
        </HoverCardContent>
      </HoverCard>
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger className="text-sky-500 underline-offset-2 hover:underline">
          {node.data.identifier.value}
        </HoverCardTrigger>
        <HoverCardContent className="flex flex-col gap-y-2">
          <p>
            <span className="font-black text-sky-500">
              `{node.data.identifier.value}`
            </span>{" "}
            is the name of the function. Function names are similar to variable
            names they follow the following rules:
          </p>
          <ul className="list-inside list-disc flex-col">
            <li className="list-item">
              <span className="font-bold">Must</span> start with a letter
              [a-zA-Z] or an underscore.
            </li>
            <li className="list-item">
              <span className="font-bold">Cannot</span> start with a number
              [0-9].
            </li>
          </ul>
        </HoverCardContent>
      </HoverCard>
      {node.data.params.length > 0 && (
        <div className="flex">
          {"("}
          {node.data.params.map((param, index) => (
            <>
              <HoverCard key={index} openDelay={100} closeDelay={100}>
                <HoverCardTrigger className="text-sky-500 underline-offset-2 hover:underline">
                  {getParam(param).value}
                </HoverCardTrigger>
                <HoverCardContent>
                  <p>
                    <span className="font-black text-sky-500">
                      `{getParam(param).value}`
                    </span>{" "}
                    is a parameter name. Parameters are used to pass values to
                    functions.
                  </p>
                </HoverCardContent>
              </HoverCard>
              {index < node.data.params.length - 1 && ", "}
            </>
          ))}
          {")"}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        className="!border-pink-500 !bg-background"
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-pink-500 !bg-background"
        isConnectable={false}
      />
    </div>
  );
});
