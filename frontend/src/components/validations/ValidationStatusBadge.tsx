import type { CompletenessStatus, SemanticStatus } from "../../types/validation.types";

interface ValidationStatusBadgeProps {
  label: string;
  value: boolean | CompletenessStatus | SemanticStatus;
}

const getBadgeStyles = (
  value: boolean | CompletenessStatus | SemanticStatus
): React.CSSProperties => {
  if (value === true || value === "complete" || value === "valid") {
    return {
      background: "#dcfce7",
      color: "#166534",
    };
  }

  if (value === false || value === "missing_required" || value === "invalid") {
    return {
      background: "#fee2e2",
      color: "#991b1b",
    };
  }

  return {
    background: "#fef3c7",
    color: "#92400e",
  };
};

function ValidationStatusBadge({
  label,
  value,
}: ValidationStatusBadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "14px",
        ...getBadgeStyles(value),
      }}
    >
      <strong>{label}:</strong>
      <span>{String(value)}</span>
    </span>
  );
}

export default ValidationStatusBadge;