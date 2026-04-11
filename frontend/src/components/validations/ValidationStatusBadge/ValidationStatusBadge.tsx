import type {
  CompletenessStatus,
  SemanticStatus,
} from "../../../types/validation.types";
import "./ValidationStatusBadge.css";

interface ValidationStatusBadgeProps {
  label: string;
  value: boolean | CompletenessStatus | SemanticStatus;
}

const getBadgeModifier = (
  value: boolean | CompletenessStatus | SemanticStatus
): string => {
  if (value === true || value === "complete" || value === "valid") {
    return "validation-status-badge--success";
  }

  if (value === false || value === "missing_required" || value === "invalid") {
    return "validation-status-badge--danger";
  }

  return "validation-status-badge--warning";
};

function ValidationStatusBadge({
  label,
  value,
}: ValidationStatusBadgeProps) {
  return (
    <span
      className={`validation-status-badge ${getBadgeModifier(value)}`}
    >
      <strong className="validation-status-badge__label">{label}:</strong>
      <span className="validation-status-badge__value">{String(value)}</span>
    </span>
  );
}

export default ValidationStatusBadge;