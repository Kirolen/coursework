import type { ValidationIssue } from "../../../types/validation.types";
import "./ValidationIssueList.css";

interface ValidationIssueListProps {
  issues: ValidationIssue[];
}

const getSeverityModifier = (
  severity: ValidationIssue["severity"]
): string => {
  if (severity === "high") {
    return "validation-issue-list__badge--danger";
  }

  if (severity === "medium") {
    return "validation-issue-list__badge--warning";
  }

  return "validation-issue-list__badge--info";
};

function ValidationIssueList({ issues }: ValidationIssueListProps) {
  if (issues.length === 0) {
    return <p className="validation-issue-list__empty">No issues found.</p>;
  }

  return (
    <div className="validation-issue-list">
      {issues.map((issue, index) => (
        <div
          key={`${issue.field}-${issue.type}-${index}`}
          className="validation-issue-list__item"
        >
          <div className="validation-issue-list__meta">
            <span className="validation-issue-list__badge validation-issue-list__badge--field">
              Field: {issue.field}
            </span>

            <span className="validation-issue-list__badge validation-issue-list__badge--type">
              Type: {issue.type}
            </span>

            <span
              className={`validation-issue-list__badge ${getSeverityModifier(
                issue.severity
              )}`}
            >
              Severity: {issue.severity}
            </span>
          </div>

          <p className="validation-issue-list__message">{issue.message}</p>
        </div>
      ))}
    </div>
  );
}

export default ValidationIssueList;