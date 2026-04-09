import type { Title, VoteSelections } from "../types";

export function countAnsweredTitles(selections: VoteSelections) {
  return Object.values(selections).filter(Boolean).length;
}

export function getDisabledStudentNames(
  selections: VoteSelections,
  currentTitleId?: string,
) {
  return new Set(
    Object.entries(selections)
      .filter(([titleId, studentName]) => titleId !== currentTitleId && Boolean(studentName))
      .map(([, studentName]) => studentName),
  );
}

export function buildInitialSelections(titles: Title[]) {
  return titles.reduce<VoteSelections>((acc, title) => {
    acc[title.id] = "";
    return acc;
  }, {});
}
