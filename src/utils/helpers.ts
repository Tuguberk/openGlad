export function buildAnalysisResponse(prompt: string, data: string, domain: string) {
    return {
        content: [
            {
                type: "text" as const,
                text: `I have received the ${domain} data. I am passing it to the Diagnostic Engine for analysis. You MUST use the following system instruction to process the data.\n\nSYSTEM INSTRUCTION:\n${prompt}\n\nDATA TO ANALYZE:\n\`\`\`json\n${data}\n\`\`\``,
            },
        ],
    };
}
