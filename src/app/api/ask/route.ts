import { app } from "@/lib/Graph"; 
import { AIMessage, HumanMessage } from "@langchain/core/messages";

// Define types for expected response structure


interface FinalState {
  messages: AIMessage[];
}

export async function POST(req: Request) {
  const { input } = await req.json();

  const inputs = {
    messages: [new HumanMessage(input)],
  };

  let finalState: FinalState | undefined;
  let responseContent: Record<string, any> = {}; // Store the final AI response

  for await (const output of await app.stream(inputs)) {
    for (const [key, value] of Object.entries(output)) {
      const lastMsg = output[key].messages?.[output[key].messages.length - 1];

      console.log(`Output from node: '${key}'`);
      console.dir(
        {
          type: lastMsg?._getType(),
          content: lastMsg?.content,
          tool_calls: lastMsg?.tool_calls,
        },
        { depth: null }
      );
      console.log("---\n");

      // Store final response content if the node is 'generate'
      if (key === "generate") {
        responseContent = {
          node: key,
          type: lastMsg._getType(),
          content: lastMsg.content,
          tool_calls: lastMsg.tool_calls,
        };
      }

      finalState = value as FinalState; // Ensure correct type assignment
    }
  }

  console.log(JSON.stringify({ finalState }, null, 2));

  // Safely access finalState properties using optional chaining
  console.log(
    "Final Response Content:",
    finalState?.messages?.[0].content || "No content found"
  );

  // Return the extracted response
  return Response.json( finalState?.messages?.[0].content || "No content found");
}
