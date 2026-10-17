import { isAxiosError } from "axios";

export type ServiceErrorCode =
  | "INVALID_CREDENTIALS"
  | "VALIDATION"
  | "RATE_LIMITED"
  | "FORBIDDEN"
  | "NETWORK"
  | "SERVER"
  | "UNKNOWN";

export class ServiceError extends Error {
  code: ServiceErrorCode;
  status: number | null;
  fieldErrors: Record<string, string>;

  constructor(
    code: ServiceErrorCode,
    message: string,
    status: number | null = null,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function readBody(data: unknown): {
  message?: string;
  fieldErrors: Record<string, string>;
} {
  if (typeof data !== "object" || data === null) return { fieldErrors: {} };
  const record = data as Record<string, unknown>;
  const message =
    typeof record.message === "string" ? record.message : undefined;
  const raw = record.fieldErrors;
  const fieldErrors =
    typeof raw === "object" && raw !== null
      ? Object.fromEntries(
          Object.entries(raw).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : {};
  return { message, fieldErrors };
}

// Maps HTTP outcomes to the behaviours defined in FR-08.
export function toServiceError(error: unknown): ServiceError {
  if (error instanceof ServiceError) return error;
  if (!isAxiosError(error))
    return new ServiceError(
      "UNKNOWN",
      "Something went wrong. Please try again.",
    );
  if (!error.response) {
    return new ServiceError(
      "NETWORK",
      "Cannot reach the server. Check your connection and retry.",
    );
  }

  const { status, data } = error.response;
  const body = readBody(data);

  if (status === 400 || status === 422) {
    return new ServiceError(
      "VALIDATION",
      body.message ?? "Please correct the highlighted fields.",
      status,
      body.fieldErrors,
    );
  }
  if (status === 401) {
    return new ServiceError(
      "INVALID_CREDENTIALS",
      body.message ?? "Invalid login ID or password.",
      status,
    );
  }
  if (status === 403) {
    return new ServiceError(
      "FORBIDDEN",
      "You do not have permission for this action.",
      status,
    );
  }
  if (status === 429) {
    return new ServiceError(
      "RATE_LIMITED",
      body.message ?? "Too many attempts. Try again later.",
      status,
    );
  }
  if (status >= 500) {
    return new ServiceError(
      "SERVER",
      "The server had a problem. Please retry.",
      status,
    );
  }
  return new ServiceError(
    "UNKNOWN",
    body.message ?? "Something went wrong. Please try again.",
    status,
  );
}
