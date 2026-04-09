import type { CharacterValidation } from "../../types/validation.types";
import ValidationIssueList from "./ValidationIssueList";
import ValidationStatusBadge from "./ValidationStatusBadge";

interface ValidationPanelProps {
  validation: CharacterValidation | null;
  isLoading?: boolean;
  error?: string | null;
  onRunSemanticValidation?: () => Promise<void>;
  isRunning?: boolean;
}

function ValidationPanel({
  validation,
  isLoading = false,
  error = null,
  onRunSemanticValidation,
  isRunning = false,
}: ValidationPanelProps) {
  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "24px",
        display: "grid",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 6px 0" }}>Validation</h2>
          <p style={{ margin: 0, color: "#6b7280" }}>
            Latest validation result for this character
          </p>
        </div>

        {onRunSemanticValidation && (
          <button
            onClick={() => {
              void onRunSemanticValidation();
            }}
            disabled={isRunning}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              cursor: "pointer",
              opacity: isRunning ? 0.7 : 1,
            }}
          >
            {isRunning ? "Running..." : "Run Semantic Validation"}
          </button>
        )}
      </div>

      {isLoading ? (
        <p style={{ margin: 0 }}>Loading validation...</p>
      ) : error ? (
        <div
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            padding: "12px 14px",
            borderRadius: "10px",
          }}
        >
          {error}
        </div>
      ) : !validation ? (
        <p style={{ margin: 0 }}>No validation found yet.</p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <ValidationStatusBadge
              label="Schema"
              value={validation.schemaValid}
            />
            <ValidationStatusBadge
              label="Completeness"
              value={validation.completenessStatus}
            />
            <ValidationStatusBadge
              label="Semantic"
              value={validation.semanticStatus}
            />
          </div>

          <div>
            <h3 style={{ marginBottom: "8px" }}>Missing Fields</h3>
            {validation.missingFields.length === 0 ? (
              <p style={{ margin: 0 }}>No missing fields.</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {validation.missingFields.map((field) => (
                  <span
                    key={field}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "#fee2e2",
                      color: "#991b1b",
                      fontSize: "14px",
                    }}
                  >
                    {field}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ marginBottom: "8px" }}>Issues</h3>
            <ValidationIssueList issues={validation.issues} />
          </div>

          <div style={{ color: "#6b7280", fontSize: "14px" }}>
            Last validated: {new Date(validation.validatedAt).toLocaleString()}
          </div>
        </>
      )}
    </section>
  );
}

export default ValidationPanel;