// src/lib/AgentState.ts
import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { createRetrieverTool } from "langchain/tools/retriever";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { retrieverTool } from "./Retriever";

export const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  })
})

const tool = createRetrieverTool(
  retrieverTool,
  {
    name: "retrieve_bhagavadgitha",
    description:
      "Search and return information from bhagavadgitha.",
  },
);
export const tools = [tool];

export const toolNode = new ToolNode<typeof GraphState.State>(tools);