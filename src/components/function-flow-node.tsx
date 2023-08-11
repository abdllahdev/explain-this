import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { FunctionDeclaration, Param } from "@swc/wasm-web";

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
      <span className="text-pink-500 underline-offset-2 hover:underline">
        function
      </span>
      <span className="text-sky-500 underline-offset-2 hover:underline">
        {node.data.identifier.value}
      </span>
      {node.data.params.length > 0 && (
        <div className="flex">
          {"("}
          {node.data.params.map((param, index) => (
            <>
              <span key={index} className="underline-offset-2 hover:underline">
                {getParam(param).value}
              </span>
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
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-pink-500 !bg-background"
      />
    </div>
  );
});
