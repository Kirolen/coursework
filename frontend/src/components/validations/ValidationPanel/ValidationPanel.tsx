import type { CharacterValidation } from "../../../types/validation.types";
import ValidationIssueList from "../ValidationIssueList/ValidationIssueList";
import ValidationStatusBadge from "../ValidationStatusBadge/ValidationStatusBadge";
import "./ValidationPanel.css";

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
    <section className="validation-panel">
      <div className="validation-panel__header">
        <div className="validation-panel__heading">
          <h2 className="validation-panel__title">Validation</h2>
          <p className="validation-panel__subtitle">
            Latest validation result for this character
          </p>
        </div>

        {onRunSemanticValidation && (
          <button
            type="button"
            className="validation-panel__action"
            onClick={() => {
              void onRunSemanticValidation();
            }}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run Semantic Validation"}
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="validation-panel__state">Loading validation...</p>
      ) : error ? (
        <div className="validation-panel__error">{error}</div>
      ) : !validation ? (
        <p className="validation-panel__state">No validation found yet.</p>
      ) : (
        <>
          <div className="validation-panel__badges">
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

          <div className="validation-panel__section">
            <h3 className="validation-panel__section-title">Missing Fields</h3>

            {validation.missingFields.length === 0 ? (
              <p className="validation-panel__state">No missing fields.</p>
            ) : (
              <div className="validation-panel__missing-list">
                {validation.missingFields.map((field) => (
                  <span
                    key={field}
                    className="validation-panel__missing-item"
                  >
                    {field}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="validation-panel__section">
            <h3 className="validation-panel__section-title">Issues</h3>
            <ValidationIssueList issues={validation.issues} />
          </div>

          <div className="validation-panel__footer">
            Last validated: {new Date(validation.validatedAt).toLocaleString()}
          </div>
        </>
      )}
    </section>
  );
}

export default ValidationPanel;