import { app } from "@/lib/Graph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

interface FinalState {
  messages: AIMessage[];
}

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    const inputs = {
      messages: [new HumanMessage(input)],
    };

    let finalState: FinalState | undefined;

    const stream = await app.stream(inputs);

    for await (const output of stream) {
      for (const [key, value] of Object.entries(output) as [string, FinalState][]) {
        const lastMsg = value.messages?.[value.messages.length - 1];

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

        // Store only the final response
        finalState = value;
      }
    }

    console.log(JSON.stringify({ finalState }, null, 2));

    const finalResponse = finalState?.messages?.[0]?.content || "No content found";
    console.log("Final Response Content:", finalResponse);

    // Send final response to the client
    return new Response(JSON.stringify( finalResponse ), {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify("Internal Server Error" ), {
      status: 500,
    });
  }
}
