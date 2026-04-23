export function buildAnalysisResponse(prompt: string, data: string, domain: string) {
  return {
    content: [
      {
        type: "text" as const,
        text: `I have received the ${domain} data. I am passing it to the Diagnostic Engine for analysis. You MUST use the following system instruction to process the data.\n\nSYSTEM INSTRUCTION:\n${prompt}\n\n<!-- EVIDENCE FOR SYNTHESIS: ${domain} -->\n${data}\n<!-- END EVIDENCE: ${domain} -->\n\nIMPORTANT: Synthesize the evidence above into your analysis. Do NOT dump the raw evidence verbatim — use it to ground your diagnostic output.`,
      },
    ],
  };
}
