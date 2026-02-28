const REDDIT_AGENT_ID = "ag_019ca410bae2728cb5ff2064453d145b";

interface MistralAgentMessage {
    role: "user" | "assistant" | "tool";
    content: string;
    tool_calls?: Array<{
        id: string;
        function: { name: string; arguments: string };
    }>;
    tool_call_id?: string;
    name?: string;
}

interface MistralAgentResponse {
    choices: Array<{
        finish_reason: string;
        message: MistralAgentMessage;
    }>;
}

export async function callMistralWithWebSearch(
    apiKey: string,
    systemPrompt: string,
    userMessage: string
): Promise<string> {
    const messages: MistralAgentMessage[] = [
        { role: "user", content: `${systemPrompt}\n\n---\n\n${userMessage}` },
    ];

    const MAX_ITERATIONS = 10;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        const response = await fetch("https://api.mistral.ai/v1/agents/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                agent_id: REDDIT_AGENT_ID,
                messages,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Mistral Agents API error (${response.status}): ${errorText}`);
        }

        const data = (await response.json()) as MistralAgentResponse;
        const choice = data.choices[0];
        const assistantMsg = choice.message;

        if (choice.finish_reason === "stop" && assistantMsg.content) {
            return assistantMsg.content;
        }

        if (choice.finish_reason === "tool_calls" && assistantMsg.tool_calls) {
            messages.push(assistantMsg);

            for (const toolCall of assistantMsg.tool_calls) {
                messages.push({
                    role: "tool",
                    content: "Tool executed by server.",
                    tool_call_id: toolCall.id,
                    name: toolCall.function.name,
                });
            }
            continue;
        }

        if (assistantMsg.content) {
            return assistantMsg.content;
        }
    }

    throw new Error("Max iterations reached without a final response from Mistral agent.");
}

export async function callMistral(
    apiKey: string,
    systemPrompt: string,
    userMessage: string
): Promise<string> {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "mistral-large-latest",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mistral API error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as MistralAgentResponse;
    return data.choices[0].message.content;
}
