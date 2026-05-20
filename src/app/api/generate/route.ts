import { streamObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { ProjectBriefSchema } from '@/lib/schema';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

const PROMPT = (prompt: string) => `You are an expert software architect. Create a comprehensive project brief for a web application based on this idea: "${prompt}".

Return a JSON object with these exact fields:
- appName: a catchy, memorable name for the application (short, 2-3 words maximum)
- summary: a short paragraph describing the app
- targetUsers: array of user types (e.g. ["freelancers", "small teams"])
- coreFeatures: array of feature descriptions
- techStack: array of technologies (e.g. ["Next.js", "Tailwind CSS"])
- pages: array of objects with "route" (e.g. "/dashboard") and "description"
- dataModel: object with:
    - entities: array of objects with "id" (camelCase, no spaces, MUST match the name used in relations), "name", and "attributes" (array of strings)
    - relations: array of objects with "source" (MUST match entity id exactly), "target" (MUST match entity id exactly), and "type" (e.g. "one-to-many")
    - CRITICAL: The "id" field in entities MUST be used as the source and target in relations. Use the exact same string.
- buildPhases: array of objects with "phase" (number), "name", and "tasks" (array of strings)
- risks: array of potential risk descriptions

Keep responses concise. Do not add any extra fields.`;

const MODELS = [
  'deepseek/deepseek-v4-flash:free',
  'meta-llama/llama-4-scout:free',
  'mistralai/mistral-small-3.2-24b-instruct:free',
];

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response('Prompt is required', { status: 400 });
    }

    let lastError: Error | null = null;

    for (const modelId of MODELS) {
      try {
        console.log(`Trying model: ${modelId}`);
        const result = await streamObject({
          model: openrouter(modelId),
          schema: ProjectBriefSchema,
          prompt: PROMPT(prompt),
          maxTokens: 4000,
        });
        return result.toTextStreamResponse();
      } catch (err) {
        console.warn(`Model ${modelId} failed:`, err instanceof Error ? err.message : err);
        lastError = err instanceof Error ? err : new Error(String(err));
        // only retry on rate limit or server errors
        if (lastError.message.includes('402')) break;
        continue;
      }
    }

    const message = lastError?.message || 'All models failed';
    return new Response(message, { status: 500 });
  } catch (error) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(message, { status: 500 });
  }
}
