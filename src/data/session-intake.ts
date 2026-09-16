/** Workshop session captured before anyone can use the Tax Labs hub. */

export type DeliveryMode = "online" | "in-person";

export type SessionIntake = {
  clientName: string;
  sessionName: string;
  sessionDate: string;
  durationHours: string;
  facilitator: string;
  location: string;
  totalParticipants: string;
  deliveryMode: DeliveryMode;
};

export type SessionField = keyof SessionIntake;

export const SESSION_INTAKE_STORAGE_KEY = "ey-tax-labs:session-intake";

/** Names shown in the Facilitator dropdown — edit this list when the team changes. */
export const FACILITATOR_OPTIONS = [
  "EY Tax AI Team",
  "EY India Tax — North",
  "EY India Tax — West",
  "EY India Tax — South",
  "EY India Tax — East",
] as const;

/** Places shown in the Location dropdown. */
export const LOCATION_OPTIONS = [
  "Online",
  "Ahmedabad",
  "Bengaluru",
  "Chennai",
  "Gurugram",
  "Hyderabad",
  "Kochi",
  "Kolkata",
  "Mumbai",
  "Noida",
  "Pune",
] as const;

export const EMPTY_SESSION_INTAKE: SessionIntake = {
  clientName: "",
  sessionName: "",
  sessionDate: "",
  durationHours: "",
  facilitator: "",
  location: "",
  totalParticipants: "",
  deliveryMode: "in-person",
};

export type SessionFieldErrors = Partial<Record<SessionField, string>>;

function isDeliveryMode(value: unknown): value is DeliveryMode {
  return value === "online" || value === "in-person";
}

function isSessionIntake(value: unknown): value is SessionIntake {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.clientName === "string" &&
    typeof row.sessionName === "string" &&
    typeof row.sessionDate === "string" &&
    typeof row.durationHours === "string" &&
    typeof row.facilitator === "string" &&
    typeof row.location === "string" &&
    typeof row.totalParticipants === "string" &&
    isDeliveryMode(row.deliveryMode)
  );
}

export function todayDateValue(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function blankSessionIntake(): SessionIntake {
  return { ...EMPTY_SESSION_INTAKE, sessionDate: todayDateValue() };
}

export function readSessionIntake(): SessionIntake | null {
  try {
    const raw = window.localStorage.getItem(SESSION_INTAKE_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSessionIntake(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSessionIntake(session: SessionIntake): void {
  window.localStorage.setItem(SESSION_INTAKE_STORAGE_KEY, JSON.stringify(session));
}

/** Forget any previous workshop so a new visit always starts on a blank form. */
export function clearSessionIntake(): void {
  try {
    window.localStorage.removeItem(SESSION_INTAKE_STORAGE_KEY);
  } catch {
    // Private browsing can block storage — the form still opens blank.
  }
}

export function validateSessionIntake(session: SessionIntake): SessionFieldErrors {
  const errors: SessionFieldErrors = {};
  const required: SessionField[] = [
    "clientName",
    "sessionName",
    "sessionDate",
    "facilitator",
    "location",
  ];

  for (const key of required) {
    if (!session[key].trim()) errors[key] = "This field is required.";
  }

  if (
    session.facilitator &&
    !(FACILITATOR_OPTIONS as readonly string[]).includes(session.facilitator)
  ) {
    errors.facilitator = "Choose a facilitator from the list.";
  }

  if (
    session.location &&
    !(LOCATION_OPTIONS as readonly string[]).includes(session.location)
  ) {
    errors.location = "Choose a location from the list.";
  }

  const hours = Number(session.durationHours);
  if (!session.durationHours.trim() || !Number.isFinite(hours) || hours <= 0) {
    errors.durationHours = "Enter duration in hours, greater than 0.";
  }

  const people = Number(session.totalParticipants);
  if (
    !session.totalParticipants.trim() ||
    !Number.isInteger(people) ||
    people < 1
  ) {
    errors.totalParticipants = "Enter a whole number of 1 or more.";
  }

  if (!isDeliveryMode(session.deliveryMode)) {
    errors.deliveryMode = "Choose Online or In person.";
  }

  return errors;
}
