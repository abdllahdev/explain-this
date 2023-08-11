import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { type ModuleItem } from "@swc/wasm-web";

import FunctionFlowNode from "./function-flow-node";

import "reactflow/dist/style.css";

const nodeTypes: NodeTypes = {
  functionFlowNode: FunctionFlowNode,
};

function getNodesAndEdges(
  nodes: Node[],
  edges: Edge[],
  ast: ModuleItem[],
  currPos: { x: number; y: number },
  source?: string
) {
  ast.map((item) => {
    switch (item.type) {
      case "FunctionDeclaration":
        if (source)
          edges.push({
            id: `${source}-${item.span.start}-${item.span.end}`,
            source,
            target: `${item.span.start}-${item.span.end}`,
          });

        nodes.push({
          id: `${item.span.start}-${item.span.end}`,
          data: { ...item },
          type: "functionFlowNode",
          position: currPos,
        });

        if (item.body?.stmts) {
          const newPos = { x: currPos.x, y: currPos.y };
          getNodesAndEdges(
            nodes,
            edges,
            item.body.stmts,
            newPos,
            `${item.span.start}-${item.span.end}`
          );
        }
        break;
      default:
        break;
    }
  });
}

interface Props {
  ast: ModuleItem[];
}

export default function FlowGraph({ ast }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleChange = useCallback(
    (ast: ModuleItem[]) => {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      getNodesAndEdges(newNodes, newEdges, ast, { x: 0, y: 0 });
      setNodes([...newNodes]);
      setEdges([...newEdges]);
    },
    [setEdges, setNodes]
  );

  useEffect(() => {
    handleChange(ast);
  }, [ast, handleChange]);

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
