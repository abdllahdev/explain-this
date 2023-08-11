"use client";

import ReactFlow, {
  Background,
  BackgroundVariant,
  MiniMap,
  NodeTypes,
} from "reactflow";
import { type ModuleItem } from "@swc/wasm-web";

import useFlow from "@/hooks/useFlow";

import FunctionFlowNode from "./function-flow-node";

import "reactflow/dist/style.css";

interface Props {
  ast: ModuleItem[];
}

const nodeTypes: NodeTypes = {
  functionFlowNode: FunctionFlowNode,
};

export default function FlowGraph({ ast }: Props) {
  const { nodes, onNodesChange, edges, onEdgesChange } = useFlow(ast);

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
