import { z } from "zod";

export const ProjectBriefSchema = z.object({
  appName: z.string().describe("The name of the application"),
  summary: z.string().describe("A short paragraph describing the app"),
  targetUsers: z.array(z.string()).describe("Array of user types"),
  coreFeatures: z.array(z.string()).describe("Array of feature descriptions"),
  techStack: z.array(z.string()).describe("Array of technologies"),
  pages: z.array(z.object({
    route: z.string().describe("The route path"),
    description: z.string().describe("Description of the page"),
  })).describe("Array of page routes and descriptions"),
  dataModel: z.object({
    entities: z.array(z.object({
      id: z.string().describe("camelCase, no spaces, MUST match the name used in relations"),
      name: z.string().describe("Display name of the entity"),
      attributes: z.array(z.string()).describe("Array of attribute names"),
    })).describe("Array of data entities"),
    relations: z.array(z.object({
      source: z.string().describe("MUST match entity id exactly"),
      target: z.string().describe("MUST match entity id exactly"),
      type: z.string().describe("e.g. one-to-many, many-to-many"),
    })).describe("Array of entity relationships"),
  }).describe("Data model with entities and relations"),
  buildPhases: z.array(z.object({
    phase: z.number().describe("Phase number"),
    name: z.string().describe("Name of the phase"),
    tasks: z.array(z.string()).describe("Array of tasks in this phase"),
  })).describe("Array of build phases"),
  risks: z.array(z.string()).describe("Array of potential risks"),
});

export type ProjectBrief = z.infer<typeof ProjectBriefSchema>;

export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

