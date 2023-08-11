import { useCallback, useEffect } from "react";
import {
  Edge,
  Node,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { ModuleItem } from "@swc/wasm-web";
import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const defaultElkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
  "elk.direction": "DOWN",
};

async function createNodesAndEdges(ast: ModuleItem[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const traverse = async (ast: ModuleItem[], source?: string) => {
    await ast.map((item) => {
      switch (item.type) {
        case "FunctionDeclaration":
          if (source)
            edges.push({
              id: `${source}-${item.span.start}-${item.span.end}`,
              source: source,
              target: `${item.span.start}-${item.span.end}`,
            });

          nodes.push({
            id: `${item.span.start}-${item.span.end}`,
            data: { ...item },
            position: { x: 0, y: 0 },
            type: "functionFlowNode",
          });

          if (item.body?.stmts) {
            traverse(item.body.stmts, `${item.span.start}-${item.span.end}`);
          }
          break;
        default:
          break;
      }
    });
  };

  try {
    await traverse(ast);
    return { nodes, edges };
  } catch (e) {
    throw Error(`${e}`);
  }
}

async function getLayoutedElements(ast: ModuleItem[]) {
  const NODE_WIDTH = 150;
  const NODE_HEIGHT = 100;

  try {
    const { nodes, edges } = await createNodesAndEdges(ast);

    const graph: ElkNode = {
      id: "root",
      layoutOptions: defaultElkOptions,
      children: nodes.map((node) => ({
        ...node,
        targetPosition: "top",
        sourcePosition: "bottom",
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      })),
      edges,
    };

    try {
      const layoutedGraph = await elk.layout(graph);

      if (!layoutedGraph) {
        throw new Error("Layout operation failed or returned empty graph.");
      }

      const { children, edges } = layoutedGraph;

      return {
        nodes:
          children?.map((node) => ({
            ...node,
            position: { x: node.x, y: node.y },
          })) || [],
        edges: edges || [],
      };
    } catch (layoutError) {
      throw new Error(`Layouting error: ${layoutError}`);
    }
  } catch (createError) {
    throw new Error(`Creation error: ${createError}`);
  }
}

export default function useFlow(ast: ModuleItem[]) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const handleChange = useCallback(
    async (ast: ModuleItem[]) => {
      try {
        const { nodes, edges } = await getLayoutedElements(ast);

        setNodes(nodes);
        setEdges(edges);

        window.requestAnimationFrame(() => fitView());
      } catch (error) {
        console.error(error);
      }
    },
    [setNodes, setEdges, fitView]
  );

  useEffect(() => {
    handleChange(ast);
  }, [ast, handleChange]);

  return { nodes, onNodesChange, edges, onEdgesChange };
}
