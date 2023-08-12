"use client";

import ReactFlow, {
  Background,
  BackgroundVariant,
  MiniMap,
  NodeTypes,
  ReactFlowProvider,
} from "reactflow";
import { type ModuleItem } from "@swc/wasm-web";

import { useCodeFlow } from "@/hooks/code-flow-hooks";

import FunctionFlowNode from "./function-flow-node";

import "reactflow/dist/style.css";

interface Props {
  ast: ModuleItem[];
}

const nodeTypes: NodeTypes = {
  functionFlowNode: FunctionFlowNode,
};

function CodeFlow({ ast }: Props) {
  const { nodes, onNodesChange, edges, onEdgesChange } = useCodeFlow(ast);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap className="!bg-background" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default function CodeFlowWrapper({ ast }: Props) {
  return (
    <ReactFlowProvider>
      <CodeFlow ast={ast}></CodeFlow>
    </ReactFlowProvider>
  );
}
