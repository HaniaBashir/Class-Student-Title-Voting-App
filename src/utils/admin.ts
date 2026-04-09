import type { AggregatedVote, Title } from "../types";

type VoteRow = {
  title_id: string;
  selected_student_name: string;
  titles:
    | {
        title_name: string;
        display_order: number;
      }[]
    | {
    title_name: string;
    display_order: number;
      }
    | null;
};

export function aggregateVotes(titles: Title[], votes: VoteRow[]): AggregatedVote[] {
  const grouped = votes.reduce<Map<string, Map<string, number>>>((acc, vote) => {
    const byStudent = acc.get(vote.title_id) ?? new Map<string, number>();
    byStudent.set(
      vote.selected_student_name,
      (byStudent.get(vote.selected_student_name) ?? 0) + 1,
    );
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
