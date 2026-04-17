export type Student = {
  id: string;
  roll_number: string;
  student_name: string;
};

export type TitleType = "single" | "duo";

export type Title = {
  id: string;
  title_name: string;
  display_order: number;
  title_type: TitleType;
};

export type TitleSelection = {
  primary: string;
  secondary: string;
  isDuo: boolean;
};

export type VoteSelections = Record<string, TitleSelection>;

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
};

export type AggregatedVote = {
  titleId: string;
  titleName: string;
  titleType: TitleType;
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

export type VoterCredential = {
  id: string;
  roll_number: string;
  student_name: string;
  voter_password: string;
  is_used: boolean;
  used_at: string | null;
};
