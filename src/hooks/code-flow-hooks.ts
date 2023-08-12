import {
  createRef,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Edge,
  Node,
  Position,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { ModuleItem } from "@swc/wasm-web";
import ELK, { ElkExtendedEdge, ElkNode } from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const defaultElkOptions = {
  "elk.algorithm": "mrtree",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "50",
  "elk.direction": "DOWN",
};

async function createElements(ast: ModuleItem[]) {
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

async function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  try {
    const graph: ElkNode = {
      id: "root",
      layoutOptions: defaultElkOptions,
      children: nodes.map((node) => ({
        ...node,
        targetPosition: Position.Bottom,
        sourcePosition: Position.Top,
        width: 200,
        height: 100,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    try {
      const layoutedGraph = await elk.layout(graph);

      if (!layoutedGraph) {
        throw new Error("Layout operation failed or returned empty graph.");
      }

      const { children, edges } = layoutedGraph;

      return {
        nodes:
          children?.map(
            (node) =>
              ({
                ...node,
                position: { x: node.x, y: node.y },
              }) as Node
          ) || [],
        edges:
          edges?.map((edge) => ({
            id: edge.id,
            source: edge.sources[0],
            target: edge.targets[0],
          })) || [],
      };
    } catch (layoutError) {
      throw new Error(`Layouting error: ${layoutError}`);
    }
  } catch (createError) {
    throw new Error(`Creation error: ${createError}`);
  }
}

export function useCodeFlow(ast: ModuleItem[]) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const handleChange = useCallback(async () => {
    try {
      const { nodes: newNodes, edges: newEdges } = await createElements(ast);

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await getLayoutedElements(newNodes, newEdges);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);

      window.requestAnimationFrame(() => fitView());
    } catch (error) {
      console.error(error);
    }
  }, [ast, setNodes, setEdges, fitView]);

  useEffect(() => {
    handleChange();
  }, [handleChange]);

  return { nodes, onNodesChange, edges, onEdgesChange };
}
