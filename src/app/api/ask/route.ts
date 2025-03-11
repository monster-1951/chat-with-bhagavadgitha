// src/app/api/ask/route.ts
import { app } from "@/lib/Graph"; 
import { HumanMessage } from "@langchain/core/messages";

export async function POST(req: Request) {
  const { input } = await req.json();

  const inputs = {
    messages: [new HumanMessage(input)],
  };

  let finalState;
  let responseContent = {}; // To store the final AI response

  for await (const output of await app.stream(inputs)) {
    for (const [key, value] of Object.entries(output)) {
      const lastMsg = output[key].messages[output[key].messages.length - 1];

      console.log(`Output from node: '${key}'`);
      console.dir(
        {
          type: lastMsg._getType(),
          content: lastMsg.content,
          tool_calls: lastMsg.tool_calls,
        },
        { depth: null }
      );
      console.log("---\n");

      // Store final response content if the node is 'agent'
      if (key === "generate") {
        responseContent = {
          node: key,
          type: lastMsg._getType(),
          content: lastMsg.content,
          tool_calls: lastMsg.tool_calls,
        };
      }

      finalState = value;
    }
  }

  console.log(JSON.stringify(finalState, null, 2));

  // Return the extracted response
  return Response.json(responseContent);
}
