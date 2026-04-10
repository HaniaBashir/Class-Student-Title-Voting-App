import type { Title, VoteSelections } from "../types";

export function isDuoTitle(titleType: Title["title_type"]) {
  return titleType === "duo";
}

export function countAnsweredTitles(selections: VoteSelections) {
  return Object.values(selections).filter((selection) =>
    selection.isDuo
      ? Boolean(selection.primary) && Boolean(selection.secondary)
      : Boolean(selection.primary),
  ).length;
}

export function getDisabledStudentValues(
  selections: VoteSelections,
  currentTitleId?: string,
  currentField: "primary" | "secondary" = "primary",
) {
  const disabled = new Set<string>();

  Object.entries(selections).forEach(([titleId, selection]) => {
    if (titleId !== currentTitleId) {
      if (selection.primary) {
        disabled.add(selection.primary);
      }
      if (selection.secondary) {
        disabled.add(selection.secondary);
      }
      return;
    }

    if (currentField !== "primary" && selection.primary) {
      disabled.add(selection.primary);
    }

    if (currentField !== "secondary" && selection.secondary) {
      disabled.add(selection.secondary);
    }
  });

  return disabled;
}

export function buildInitialSelections(titles: Title[]) {
  return titles.reduce<VoteSelections>((acc, title) => {
    acc[title.id] = {
      primary: "",
      secondary: "",
      isDuo: isDuoTitle(title.title_type),
    };
    return acc;
  }, {});
}
