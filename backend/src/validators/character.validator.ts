import { z } from "zod";

const inputModeSchema = z.enum(["builder", "prompt"]);

const coreSchema = z.object({
  name: z.string().trim().min(1, "core.name is required"),
  age: z.number().int().nonnegative().nullable().optional(),
  description: z.string().trim().min(1, "core.description is required"),
  appearance: z.string().trim().min(1, "core.appearance is required"),
  traits: z
    .array(z.string().trim().min(1, "traits items must not be empty"))
    .min(1, "core.traits must contain at least 1 item"),
});

const detailsSchema = z
  .object({
    role: z.string().trim().min(1).nullable().optional(),
    genres: z
      .array(z.string().trim().min(1, "genres items must not be empty"))
      .optional(),
    abilities: z
      .array(z.string().trim().min(1, "abilities items must not be empty"))
      .optional(),
    motivation: z.string().trim().min(1).nullable().optional(),
    weaknesses: z
      .array(z.string().trim().min(1, "weaknesses items must not be empty"))
      .optional(),
  })
  .optional();

const additionalAttributesSchema = z.record(z.string(), z.string()).optional();

export const createCharacterSchema = z.object({
  inputMode: inputModeSchema,
  rawPrompt: z.string().trim().min(1).nullable().optional(),
  core: coreSchema,
  details: detailsSchema,
  additionalAttributes: additionalAttributesSchema,
});

const updateCoreSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    age: z.number().int().nonnegative().nullable().optional(),
    description: z.string().trim().min(1).optional(),
    appearance: z.string().trim().min(1).optional(),
    traits: z.array(z.string().trim().min(1)).optional(),
  })
  .optional();

const updateDetailsSchema = z
  .object({
    role: z.string().trim().min(1).nullable().optional(),
    genres: z.array(z.string().trim().min(1)).optional(),
    abilities: z.array(z.string().trim().min(1)).optional(),
    motivation: z.string().trim().min(1).nullable().optional(),
    weaknesses: z.array(z.string().trim().min(1)).optional(),
  })
  .optional();

export const updateCharacterSchema = z
  .object({
    inputMode: inputModeSchema.optional(),
    rawPrompt: z.string().trim().min(1).nullable().optional(),
    core: updateCoreSchema,
    details: updateDetailsSchema,
    additionalAttributes: z.record(z.string(), z.string()).optional(),
  })
  .refine(
    (data) =>
      data.inputMode !== undefined ||
      data.rawPrompt !== undefined ||
      data.core !== undefined ||
      data.details !== undefined ||
      data.additionalAttributes !== undefined,
    {
      message: "Request body must contain at least one field to update",
    }
  );

export const createCharacterFromPromptSchema = z.object({
  prompt: z.string().trim().min(10, "prompt must contain at least 10 characters"),
});

export type CreateCharacterDto = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterDto = z.infer<typeof updateCharacterSchema>;
export type CreateCharacterFromPromptDto = z.infer<
  typeof createCharacterFromPromptSchema
>;