export type Student = {
  id: string;
  name: string;
};

export type Title = {
  id: string;
  title_name: string;
  display_order: number;
};

export type VoteSelections = Record<string, string>;

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
};

export type AggregatedVote = {
  titleId: string;
  titleName: string;
  totalVotes: number;
  winner: {
    name: string;
    count: number;
  } | null;
  chartData: Array<{
    name: string;
    votes: number;
  }>;
};
