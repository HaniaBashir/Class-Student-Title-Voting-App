import type { AggregatedVote, Title } from "../types";

type VoteRow = {
  title_id: string;
  selected_student_name: string;
  selected_student_name_2: string | null;
  titles:
    | {
        title_name: string;
        display_order: number;
        title_type: Title["title_type"];
      }[]
    | {
        title_name: string;
        display_order: number;
        title_type: Title["title_type"];
      }
    | null;
};

function buildPairLabel(firstName: string, secondName: string) {
  return [firstName, secondName].sort((a, b) => a.localeCompare(b)).join(" + ");
}

export function aggregateVotes(titles: Title[], votes: VoteRow[]): AggregatedVote[] {
  const grouped = votes.reduce<Map<string, Map<string, number>>>((acc, vote) => {
    const titleInfo = Array.isArray(vote.titles) ? vote.titles[0] : vote.titles;
    const isDuoTitle = titleInfo ? titleInfo.title_type === "duo" : false;
    const bucketName =
      isDuoTitle && vote.selected_student_name_2
        ? buildPairLabel(vote.selected_student_name, vote.selected_student_name_2)
        : vote.selected_student_name;
    const byStudent = acc.get(vote.title_id) ?? new Map<string, number>();
    byStudent.set(bucketName, (byStudent.get(bucketName) ?? 0) + 1);
    acc.set(vote.title_id, byStudent);
    return acc;
  }, new Map());

  return titles
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((title) => {
      const counts = grouped.get(title.id) ?? new Map<string, number>();
      const chartData = [...counts.entries()]
        .map(([name, count]) => ({ name, votes: count }))
        .filter((item) => item.votes > 0)
        .sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name));

      return {
        titleId: title.id,
        titleName: title.title_name,
        titleType: title.title_type,
        totalVotes: chartData.reduce((sum, item) => sum + item.votes, 0),
        winner: chartData[0]
          ? {
              name: chartData[0].name,
              count: chartData[0].votes,
            }
          : null,
        chartData,
      };
    });
}

export function isAdminAuthenticated() {
  return sessionStorage.getItem("farewell_admin_ok") === "true";
}
