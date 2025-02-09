import * as v from "valibot";

const runAiOutput = v.object({
  response: v.string(),
  usage: v.object({
    prompt_tokens: v.number(),
    completion_tokens: v.number(),
    total_tokens: v.number(),
  }),
});

// TODO: Return multiple homyos
export async function generateHomyos(ai: Ai, base: string): Promise<string[]> {
  const output = await ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
    prompt: `以下の条件に従って、漢字を生成してください：

1. 生成する漢字の数: 2
2. 生成する漢字から連想される文字: ${base}

不適切な言葉や差別的な表現は除外してください。
生成した漢字以外の情報は除外してください。`,
  });

  try {
    const parsed = v.parse(runAiOutput, output);

    console.log({
      msg: "success generate homyo by AI",
      usage: parsed.usage,
    });

    const homyo = `釋　${parsed.response}`;

    return [homyo];
  } catch (e: unknown) {
    throw new Error(
      `Failed parse run ai output: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`
    );
  }
}
