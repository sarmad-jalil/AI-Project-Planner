import React, { useEffect } from "react";
import {
  Background,
  Controls,
  MiniMap,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  ReactFlow,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

const nodeWidth = 250;
const nodeHeight = 150;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  if (nodes.length === 0) {
    return { nodes: [], edges };
  }

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  const validNodeIds = new Set<string>();
  nodes.forEach((node) => {
    if (node.id) {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      validNodeIds.add(node.id);
    }
  });

  edges.forEach((edge) => {
    // Only add edges if both source and target nodes exist
    if (edge.source && edge.target && validNodeIds.has(edge.source) && validNodeIds.has(edge.target)) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  try {
    dagre.layout(dagreGraph);
  } catch (error) {
    console.error('Dagre layout error:', error);
    return { nodes, edges };
  }

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

import type { ProjectBrief, DeepPartial } from "@/lib/schema";

const EntityNode = ({ data }: { data: { label: string; attributes: string[] } }) => (
  <div className="bg-card border border-border shadow-lg rounded-xl min-w-[220px] overflow-hidden hover:shadow-xl transition-shadow duration-200">
    <div className="bg-gradient-to-br from-accent/20 to-violet-500/20 border-b border-border p-4 text-center">
      <div className="micro-label mb-2">Entity</div>
      <div className="font-bold font-display text-foreground text-lg tracking-tight">{data.label}</div>
    </div>
    <div className="p-4 text-xs flex flex-col gap-2 font-code bg-background/50">
      {data.attributes?.map((attr: string, i: number) => (
        <div key={i} className="flex gap-2 items-center text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          <span className="truncate">{attr}</span>
        </div>
      ))}
    </div>
  </div>
);

const nodeTypes = {
  entity: EntityNode,
} as const;

export function DataModelVisualizer({ dataModel }: { dataModel: DeepPartial<ProjectBrief["dataModel"]> | undefined }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (!dataModel || !dataModel.entities || dataModel.entities.length === 0) return;

    // Use entity.id as node ID to match what AI generates in relations
    const initialNodes: Node[] = (dataModel.entities || []).map((entity) => ({
      id: entity?.id || entity?.name?.toLowerCase().replace(/\s+/g, '') || `entity-${Math.random()}`,
      type: 'entity',
      data: { label: entity?.name || 'Unnamed', attributes: (entity?.attributes || []) as string[] },
      position: { x: 0, y: 0 },
    }));

    const initialEdges: Edge[] = (dataModel.relations || [])
      .map((rel, index: number) => {
        const sourceNode = initialNodes.find(n => n.id === rel?.source);
        const targetNode = initialNodes.find(n => n.id === rel?.target);
        
        if (!sourceNode || !targetNode) return null; // Skip edges with invalid nodes
        
        return {
          id: `e${rel?.source}-${rel?.target}-${index}`,
          source: rel?.source || '',
          target: rel?.target || '',
          label: rel?.type,
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        } as Edge;
      })
      .filter((edge): edge is Edge => edge !== null); // Type guard to filter nulls

    // Only run layout if we have valid nodes
    if (initialNodes.length === 0) return;

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [dataModel, setNodes, setEdges]);

  if (!dataModel || !dataModel.entities || dataModel.entities.length === 0) {
    return null;
  }

  return (
    <div className="paper-card w-full h-[800px] flex flex-col shadow-lg sticky top-8 overflow-hidden">
      <div className="p-5 border-b border-border/50 bg-muted/20 backdrop-blur-md z-10 flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-xl tracking-tight">Data Architecture</h3>
          <p className="text-xs text-muted-foreground mt-1">Entity relationship diagram</p>
        </div>
        <div className="micro-label">Auto-Layout</div>
      </div>
      <div className="flex-1 relative bg-background/30">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
        >
          <Controls className="bg-card border-border shadow-lg rounded-lg" />
          <MiniMap className="bg-card border-border shadow-lg rounded-lg" maskColor="var(--muted)" />
          <Background gap={20} size={1} color="var(--border)" />
        </ReactFlow>
      </div>
    </div>
  );
}
