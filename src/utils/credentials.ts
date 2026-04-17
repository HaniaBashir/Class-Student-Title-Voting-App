import type { Student, VoterCredential } from "../types";

const PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export function normalizeEmailSuffix(value: string) {
  const trimmed = value.trim().replace(/\s+/g, "");
  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("@") ? trimmed.toLowerCase() : `@${trimmed.toLowerCase()}`;
}

export function buildEmailLocalPart(rollNumber: string) {
  const normalized = rollNumber.trim().toLowerCase();
  const compact = normalized.replace(/[^a-z0-9-]/g, "");
  const match = compact.match(/^(\d+)([a-z]+)-(\d+)$/i);

  if (match) {
    const [, year, letters, serial] = match;
    return `${letters.toLowerCase()}${year}${serial}`;
  }

  return compact.replace(/[^a-z0-9]/g, "");
}

export function buildExportEmail(rollNumber: string, suffix: string) {
  return `${buildEmailLocalPart(rollNumber)}${normalizeEmailSuffix(suffix)}`;
}

export function generatePassword(length = 10) {
  const randomValues = crypto.getRandomValues(new Uint32Array(length));

  return Array.from(
    randomValues,
    (value) => PASSWORD_ALPHABET[value % PASSWORD_ALPHABET.length],
  ).join("");
}

export function escapeCsvValue(value: string) {
  const normalized = value.replace(/"/g, "\"\"");
  return /[",\n]/.test(normalized) ? `"${normalized}"` : normalized;
}

export function createCredentialsCsv(
  rows: CredentialExportRow[],
) {
  const header = ["roll_number", "student_name", "email", "password", "sent"];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [row.roll_number, row.student_name, row.email, row.password, row.sent]
        .map(escapeCsvValue)
        .join(","),
    ),
  ];

  return lines.join("\n");
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export type CredentialExportRow = {
  roll_number: string;
  student_name: string;
  email: string;
  password: string;
  sent: string;
};

export type CredentialStudentRow = Pick<Student, "roll_number" | "student_name">;

export function buildCredentialUpserts(
  students: CredentialStudentRow[],
  existingCredentials: VoterCredential[],
  regenerateAllPasswords = false,
) {
  const credentialByRoll = new Map(
    existingCredentials.map((credential) => [credential.roll_number, credential]),
  );

  return students.map((student) => {
    const existing = credentialByRoll.get(student.roll_number);
    const shouldGenerate = regenerateAllPasswords || !existing?.voter_password;

    return {
      roll_number: student.roll_number,
      student_name: student.student_name,
      voter_password: shouldGenerate ? generatePassword() : existing.voter_password,
      is_used: regenerateAllPasswords ? false : existing?.is_used ?? false,
      used_at: regenerateAllPasswords ? null : existing?.used_at ?? null,
    };
  });
}

export function buildCredentialExportRows(
  students: CredentialStudentRow[],
  credentials: Array<{
    roll_number: string;
    student_name: string;
    voter_password: string;
  }>,
  emailSuffix: string,
) {
  const normalizedSuffix = normalizeEmailSuffix(emailSuffix);
  const credentialByRoll = new Map(credentials.map((credential) => [credential.roll_number, credential]));

  return students.map<CredentialExportRow>((student) => ({
    roll_number: student.roll_number,
    student_name: student.student_name,
    email: buildExportEmail(student.roll_number, normalizedSuffix),
    password: credentialByRoll.get(student.roll_number)?.voter_password ?? "",
    sent: "",
  }));
}
