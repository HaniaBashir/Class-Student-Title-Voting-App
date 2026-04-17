export type ParsedStudentCsvRow = {
  roll_number: string;
  student_name: string;
};

export type StudentCsvParseSummary = {
  parsedRows: ParsedStudentCsvRow[];
  duplicateCount: number;
  invalidRowCount: number;
  skippedEmptyRowCount: number;
  detectedHeaders: string[];
  normalizedHeaders: string[];
  invalidRowReasons: string[];
};

export type StudentCsvParseResult =
  | StudentCsvParseSummary
  | {
      error: string;
    };

type CsvRecord = Record<string, string | null | undefined>;

const ROLL_NUMBER_ALIASES = ["rollnumber"];
const STUDENT_NAME_ALIASES = ["studentname", "name", "fullname"];

function normalizeHeader(value: string) {
  return value.replace(/^\uFEFF/, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveColumnKey(headers: string[], aliases: string[]) {
  const normalizedToOriginal = new Map(headers.map((header) => [normalizeHeader(header), header]));

  for (const alias of aliases) {
    const match = normalizedToOriginal.get(alias);
    if (match) {
      return match;
    }
  }

  return null;
}

function normalizeCellValue(value: string | null | undefined) {
  return (value ?? "").trim();
}

function isEmptyRecord(record: CsvRecord) {
  return Object.values(record).every((value) => normalizeCellValue(value) === "");
}

export function parseStudentsCsvRecords(records: CsvRecord[]): StudentCsvParseResult {
  const headers = [...new Set(records.flatMap((record) => Object.keys(record)))].filter(Boolean);
  const normalizedHeaders = headers.map(normalizeHeader);
  const rollNumberKey = resolveColumnKey(headers, ROLL_NUMBER_ALIASES);
  const studentNameKey = resolveColumnKey(headers, STUDENT_NAME_ALIASES);

  console.log("[studentsCsv] detected headers", headers);
  console.log("[studentsCsv] normalized headers", normalizedHeaders);

  if (!rollNumberKey || !studentNameKey) {
    return {
      error:
        "CSV must include a roll number column and a student name column. Examples: Roll Number, roll_number, name, or full name.",
    };
  }

  const parsedRows: ParsedStudentCsvRow[] = [];
  const seenRollNumbers = new Set<string>();
  let duplicateCount = 0;
  let invalidRowCount = 0;
  let skippedEmptyRowCount = 0;
  const invalidRowReasons: string[] = [];

  for (const [index, record] of records.entries()) {
    if (isEmptyRecord(record)) {
      skippedEmptyRowCount += 1;
      continue;
    }

    const rollNumber = normalizeCellValue(record[rollNumberKey]).toLowerCase();
    const studentName = normalizeCellValue(record[studentNameKey]);

    if (!rollNumber || !studentName) {
      invalidRowCount += 1;
      invalidRowReasons.push(
        `Row ${index + 2}: missing ${!rollNumber && !studentName ? "roll number and student name" : !rollNumber ? "roll number" : "student name"}.`,
      );
      continue;
    }

    if (seenRollNumbers.has(rollNumber)) {
      duplicateCount += 1;
      invalidRowReasons.push(`Row ${index + 2}: duplicate roll number "${rollNumber}" in uploaded CSV.`);
      continue;
    }

    seenRollNumbers.add(rollNumber);
    parsedRows.push({
      roll_number: rollNumber,
      student_name: studentName,
    });
  }

  return {
    parsedRows,
    duplicateCount,
    invalidRowCount,
    skippedEmptyRowCount,
    detectedHeaders: headers,
    normalizedHeaders,
    invalidRowReasons,
  };
}
