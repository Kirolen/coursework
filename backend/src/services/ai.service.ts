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