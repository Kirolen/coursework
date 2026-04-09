import type { ValidationIssue } from "../../types/validation.types";

interface ValidationIssueListProps {
  issues: ValidationIssue[];
}

const getSeverityStyles = (severity: ValidationIssue["severity"]): React.CSSProperties => {
  if (severity === "high") {
    return {
      background: "#fee2e2",
      color: "#991b1b",
    };
  }

  if (severity === "medium") {
    return {
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  return {
    background: "#e0f2fe",
    color: "#075985",
  };
};

function ValidationIssueList({ issues }: ValidationIssueListProps) {
  if (issues.length === 0) {
    return <p style={{ margin: 0 }}>No issues found.</p>;
  }

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {issues.map((issue, index) => (
        <div
          key={`${issue.field}-${issue.type}-${index}`}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "14px",
            background: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "999px",
                background: "#eef2ff",
                fontSize: "13px",
              }}
            >
              Field: {issue.field}
            </span>

            <span
              style={{
                padding: "4px 8px",
                borderRadius: "999px",
                background: "#f3f4f6",
                fontSize: "13px",
              }}
            >
              Type: {issue.type}
            </span>

            <span
              style={{
                padding: "4px 8px",
                borderRadius: "999px",
                fontSize: "13px",
                ...getSeverityStyles(issue.severity),
              }}
            >
              Severity: {issue.severity}
            </span>
          </div>

          <p style={{ margin: 0, lineHeight: 1.5 }}>{issue.message}</p>
        </div>
      ))}
    </div>
  );
}

export default ValidationIssueList;