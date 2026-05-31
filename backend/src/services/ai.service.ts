import OpenAI from "openai";

export interface AiCharacterResult {
  core: {
    name: string;
    age: number | null;
    description: string;
    appearance: string;
    traits: string[];
  };
  details: {
    role: string | null;
    genres: string[];
    abilities: string[];
    motivation: string | null;
    weaknesses: string[];
  };
  additionalAttributes: {
    key: string;
    value: string;
  }[];
}

export interface AiSemanticIssueResult {
  field: string;
  type: "missing" | "contradiction" | "ambiguity" | "logic_issue" | "weak_description";
  message: string;
  severity: "low" | "medium" | "high";
}

export interface AiSemanticValidationResult {
  semanticStatus: "valid" | "warning" | "invalid";
  issues: AiSemanticIssueResult[];
}

export interface AiCharacterFixSuggestionResult {
  suggestedCharacter: {
    inputMode: "builder" | "prompt";
    rawPrompt: string | null;
    core: {
      name: string;
      age: number | null;
      description: string;
      appearance: string;
      traits: string[];
    };
    details: {
      role: string | null;
      genres: string[];
      abilities: string[];
      motivation: string | null;
      weaknesses: string[];
    };
    additionalAttributes: Record<string, string>;
  };
  summary: string[];
}


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const buildPrompt = (prompt: string): string => {
  return `
You are an assistant that extracts a structured character card from user text.

Return only valid JSON matching this structure:

{
  "core": {
    "name": "string",
    "age": number | null,
    "description": "string",
    "appearance": "string",
    "traits": ["string"]
  },
  "details": {
    "role": "string | null",
    "genres": ["string"],
    "abilities": ["string"],
    "motivation": "string | null",
    "weaknesses": ["string"]
  },
  "additionalAttributes": [
  {
    "key": "string",
    "value": "string"
  }
]
}

Rules:
- Keep unknown scalar fields as null when appropriate.
- Keep unknown arrays as [].
- Do not invent too much detail.
- description should be concise but meaningful.
- traits, genres, abilities, weaknesses must always be arrays.
- additionalAttributes must always be an object.

User prompt:
${prompt}
`.trim();
};

const extractJsonFromResponse = (text: string): AiCharacterResult => {
  const parsed = JSON.parse(text) as AiCharacterResult;

return {
  core: {
    name: parsed?.core?.name ?? "Невідомий персонаж",
    age: parsed?.core?.age ?? null,
    description: parsed?.core?.description ?? "",
    appearance: parsed?.core?.appearance ?? "",
    traits: Array.isArray(parsed?.core?.traits) ? parsed.core.traits : [],
  },
  details: {
    role: parsed?.details?.role ?? null,
    genres: Array.isArray(parsed?.details?.genres) ? parsed.details.genres : [],
    abilities: Array.isArray(parsed?.details?.abilities)
      ? parsed.details.abilities
      : [],
    motivation: parsed?.details?.motivation ?? null,
    weaknesses: Array.isArray(parsed?.details?.weaknesses)
      ? parsed.details.weaknesses
      : [],
  },
  additionalAttributes: Array.isArray(parsed?.additionalAttributes)
    ? parsed.additionalAttributes.filter(
        (item) =>
          item &&
          typeof item.key === "string" &&
          typeof item.value === "string"
      )
    : [],
};
};

export const generateCharacterFromPrompt = async (
  prompt: string
): Promise<AiCharacterResult> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not defined");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.4";

  const response = await client.responses.create({
    model,
    input: buildPrompt(prompt),
text: {
  format: {
    type: "json_schema",
    name: "character_card",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        core: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            age: { type: ["number", "null"] },
            description: { type: "string" },
            appearance: { type: "string" },
            traits: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["name", "age", "description", "appearance", "traits"]
        },
        details: {
          type: "object",
          additionalProperties: false,
          properties: {
            role: { type: ["string", "null"] },
            genres: {
              type: "array",
              items: { type: "string" }
            },
            abilities: {
              type: "array",
              items: { type: "string" }
            },
            motivation: { type: ["string", "null"] },
            weaknesses: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["role", "genres", "abilities", "motivation", "weaknesses"]
        },
        additionalAttributes: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              key: { type: "string" },
              value: { type: "string" }
            },
            required: ["key", "value"]
          }
        }
      },
      required: ["core", "details", "additionalAttributes"]
    }
  }
},
  });

  const outputText = response.output_text;

  if (!outputText) {
    throw new Error("OpenAI returned empty output");
  }

  return extractJsonFromResponse(outputText);
};

const buildSemanticValidationPrompt = (character: unknown): string => {
  return `
You are validating a fictional character card.

Your task:
- detect contradictions
- detect ambiguity
- detect logic issues
- detect weak descriptions
- do not check JSON syntax or types
- focus only on semantic quality and internal consistency

Return only valid JSON.

Character card:
${JSON.stringify(character, null, 2)}
`.trim();
};

const extractSemanticValidationFromResponse = (
  text: string
): AiSemanticValidationResult => {
  const parsed = JSON.parse(text) as AiSemanticValidationResult;

  return {
    semanticStatus:
      parsed?.semanticStatus === "valid" ||
      parsed?.semanticStatus === "warning" ||
      parsed?.semanticStatus === "invalid"
        ? parsed.semanticStatus
        : "warning",
    issues: Array.isArray(parsed?.issues)
      ? parsed.issues.filter(
          (issue) =>
            issue &&
            typeof issue.field === "string" &&
            ["missing", "contradiction", "ambiguity", "logic_issue", "weak_description"].includes(issue.type) &&
            typeof issue.message === "string" &&
            ["low", "medium", "high"].includes(issue.severity)
        )
      : [],
  };
};

export const generateSemanticValidation = async (
  character: unknown
): Promise<AiSemanticValidationResult> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not defined");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.4";

  const response = await client.responses.create({
    model,
    input: buildSemanticValidationPrompt(character),
    text: {
      format: {
        type: "json_schema",
        name: "semantic_validation_result",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            semanticStatus: {
              type: "string",
              enum: ["valid", "warning", "invalid"],
            },
            issues: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  field: { type: "string" },
                  type: {
                    type: "string",
                    enum: [
                      "missing",
                      "contradiction",
                      "ambiguity",
                      "logic_issue",
                      "weak_description",
                    ],
                  },
                  message: { type: "string" },
                  severity: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                  },
                },
                required: ["field", "type", "message", "severity"],
              },
            },
          },
          required: ["semanticStatus", "issues"],
        },
      },
    },
  });

  const outputText = response.output_text;

  if (!outputText) {
    throw new Error("OpenAI returned empty semantic validation output");
  }

  return extractSemanticValidationFromResponse(outputText);
};

export const generateCharacterImage = async (
  prompt: string
): Promise<string> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not defined");
  }

  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

  const result = await client.images.generate({
    model,
    prompt,
    size: "1024x1024",
  });

  const imageBase64 = result.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error("OpenAI image generation returned empty result");
  }

  return imageBase64;
};

const buildCharacterFixSuggestionPrompt = (
  character: unknown,
  issues: unknown,
  instruction?: string | null
): string => {
  return `
You are improving an existing fictional character card based on semantic validation issues.

Return only valid JSON matching the required schema.

Rules:
- Fix semantic issues where possible.
- Improve weak or inconsistent fields.
- Preserve the character identity.
- Preserve the name unless the optional user instruction explicitly asks to change it.
- Preserve role and genres unless the optional user instruction explicitly asks to change them.
- Never generate a completely different character.
- Respect the optional user instruction while still fixing validation issues.
- Return a complete updated character payload.
- Keep inputMode and rawPrompt consistent with the original character.
- Keep arrays as arrays and additionalAttributes as an object.

Current character:
${JSON.stringify(character, null, 2)}

Semantic validation issues:
${JSON.stringify(issues, null, 2)}

Optional user instruction:
${instruction?.trim() ? instruction.trim() : "None"}
`.trim();
};

const extractCharacterFixSuggestionFromResponse = (
  text: string
): AiCharacterFixSuggestionResult => {
  const parsed = JSON.parse(text) as AiCharacterFixSuggestionResult;
  const suggested = parsed.suggestedCharacter;

  return {
    suggestedCharacter: {
      inputMode:
        suggested?.inputMode === "prompt" || suggested?.inputMode === "builder"
          ? suggested.inputMode
          : "builder",
      rawPrompt: suggested?.rawPrompt ?? null,
      core: {
        name: suggested?.core?.name ?? "",
        age: suggested?.core?.age ?? null,
        description: suggested?.core?.description ?? "",
        appearance: suggested?.core?.appearance ?? "",
        traits: Array.isArray(suggested?.core?.traits)
          ? suggested.core.traits
          : [],
      },
      details: {
        role: suggested?.details?.role ?? null,
        genres: Array.isArray(suggested?.details?.genres)
          ? suggested.details.genres
          : [],
        abilities: Array.isArray(suggested?.details?.abilities)
          ? suggested.details.abilities
          : [],
        motivation: suggested?.details?.motivation ?? null,
        weaknesses: Array.isArray(suggested?.details?.weaknesses)
          ? suggested.details.weaknesses
          : [],
      },
      additionalAttributes:
        suggested?.additionalAttributes &&
        typeof suggested.additionalAttributes === "object" &&
        !Array.isArray(suggested.additionalAttributes)
          ? suggested.additionalAttributes
          : {},
    },
    summary: Array.isArray(parsed.summary) ? parsed.summary : [],
  };
};

export const generateCharacterFixSuggestion = async (
  character: unknown,
  issues: unknown,
  instruction?: string | null
): Promise<AiCharacterFixSuggestionResult> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not defined");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.4";

  const response = await client.responses.create({
    model,
    input: buildCharacterFixSuggestionPrompt(character, issues, instruction),
    text: {
      format: {
        type: "json_schema",
        name: "character_fix_suggestion",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            suggestedCharacter: {
              type: "object",
              additionalProperties: false,
              properties: {
                inputMode: {
                  type: "string",
                  enum: ["builder", "prompt"],
                },
                rawPrompt: {
                  type: ["string", "null"],
                },
                core: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    name: { type: "string" },
                    age: { type: ["number", "null"] },
                    description: { type: "string" },
                    appearance: { type: "string" },
                    traits: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: ["name", "age", "description", "appearance", "traits"],
                },
                details: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    role: { type: ["string", "null"] },
                    genres: {
                      type: "array",
                      items: { type: "string" },
                    },
                    abilities: {
                      type: "array",
                      items: { type: "string" },
                    },
                    motivation: { type: ["string", "null"] },
                    weaknesses: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: [
                    "role",
                    "genres",
                    "abilities",
                    "motivation",
                    "weaknesses",
                  ],
                },
                additionalAttributes: {
                  type: "object",
                  additionalProperties: false,
                  properties: {},
                  required: [],
                },
              },
              required: [
                "inputMode",
                "rawPrompt",
                "core",
                "details",
                "additionalAttributes",
              ],
            },
            summary: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["suggestedCharacter", "summary"],
        },
      },
    },
  });

  const outputText = response.output_text;

  if (!outputText) {
    throw new Error("OpenAI returned empty character fix suggestion output");
  }

  return extractCharacterFixSuggestionFromResponse(outputText);
};
