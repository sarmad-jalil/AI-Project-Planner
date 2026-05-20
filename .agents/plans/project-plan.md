# AI Project Planner - Implementation Plan

## 1. Architecture & Tech Stack
*   **Framework:** Next.js (App Router, React 19)
*   **Styling:** Tailwind CSS (v4) + shadcn/ui
*   **AI Integration:** Vercel AI SDK (`ai` and `@ai-sdk/react`) paired with OpenRouter (`@ai-sdk/open-router`) for inference using a Gemini model.
*   **Data Structure/Validation:** `zod` to force the LLM to output a strictly typed JSON object.
*   **Visualization:** `@xyflow/react` (React Flow) to render an Entity-Relationship Diagram (ERD) of the generated data model.
*   **Layout Engine:** `dagre` for automatic node positioning in React Flow.
*   **State Management:** React state + Vercel AI SDK's `useObject` hook for streaming structured JSON.

## 2. Core Data Schema (Zod)
```typescript
import { z } from "zod";

export const ProjectBriefSchema = z.object({
  summary: z.string(),
  targetUsers: z.array(z.string()),
  coreFeatures: z.array(z.string()),
  techStack: z.array(z.string()),
  pages: z.array(z.object({ route: z.string(), description: z.string() })),
  dataModel: z.object({
    entities: z.array(z.object({ id: z.string(), name: z.string(), attributes: z.array(z.string()) })),
    relations: z.array(z.object({ source: z.string(), target: z.string(), type: z.string() }))
  }),
  buildPhases: z.array(z.object({ phase: z.number(), name: z.string(), tasks: z.array(z.string()) })),
  risks: z.array(z.string())
});
```

## 3. Component & Route Structure
*   **`app/page.tsx`**: Main SPA holding the state and layout.
*   **`app/api/generate/route.ts`**: Backend endpoint that calls OpenRouter via `streamObject`.
*   **Components:**
    *   `IdeaInput`: Hero section with a textarea to capture the app idea.
    *   `BriefEditor`: Grid of shadcn `Card` components containing editable `Input` and `Textarea` fields bound to the generated sections.
    *   `DataModelVisualizer`: React Flow component utilizing `dagre` for auto-layout. Maps entities to custom nodes and relations to edges.
    *   `StarterPromptExporter`: Bottom panel that watches the editor's live state, compiles it into a markdown template, and provides a "Copy Prompt" button.

## 4. Implementation Steps
1.  **Scaffolding**: 
    * Install missing dependencies (`ai`, `@ai-sdk/react`, `@ai-sdk/open-router`, `zod`, `@xyflow/react`, `dagre`).
    * Initialize shadcn components (`card`, `button`, `input`, `textarea`, `badge`). 
    * Create `.env.local` with `OPENROUTER_API_KEY`.
2.  **API Construction**: Build the `/api/generate` route using `streamObject` and the Zod schema.
3.  **Main UI Integration**: Scaffold `page.tsx` using the `useObject` hook to manage loading states and stream data into the UI.
4.  **Editable Sections**: Build out the `BriefEditor` cards for users to modify AI suggestions.
5.  **React Flow Canvas**: Implement the `DataModelVisualizer` using `dagre` for clean top-down tree visualization.
6.  **Prompt Assembly**: Build the compiler that turns customized JSON state into a rich Markdown prompt for coding agents.