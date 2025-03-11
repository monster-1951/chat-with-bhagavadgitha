// src/lib/Graph.ts
import { END, StateGraph } from "@langchain/langgraph";
import { GraphState, toolNode } from "./AgentState";
import { agent, checkRelevance, generate, gradeDocuments, rewrite, shouldRetrieve } from "./Edges";
import { START } from "@langchain/langgraph";
// Define the graph
const workflow = new StateGraph(GraphState)
  // Define the nodes which we'll cycle between.
  .addNode("agent", agent)
  .addNode("retrieve", toolNode)
  .addNode("gradeDocuments", gradeDocuments)
  .addNode("rewrite", rewrite)
  .addNode("generate", generate);


  // Call agent node to decide to retrieve or not
  workflow.addEdge(START, "agent");
  
  // Decide whether to retrieve
  workflow.addConditionalEdges(
    "agent",
    // Assess agent decision
    shouldRetrieve,
  );
  
  workflow.addEdge("retrieve", "gradeDocuments");
  
  // Edges taken after the `action` node is called.
  workflow.addConditionalEdges(
    "gradeDocuments",
    // Assess agent decision
    checkRelevance,
    {
      // Call tool node
      yes: "generate",
      no: "rewrite", // placeholder
    },
  );
  
  workflow.addEdge("generate", END);
  workflow.addEdge("rewrite", "agent");
  
  // Compile
  export const app = workflow.compile();