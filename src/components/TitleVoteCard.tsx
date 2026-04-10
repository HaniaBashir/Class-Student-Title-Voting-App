import type { SelectOption, Title } from "../types";
import SearchableSelect from "./SearchableSelect";

type TitleVoteCardProps = {
  title: Title;
  primaryValue: string;
  secondaryValue?: string;
  primaryOptions: SelectOption[];
  secondaryOptions?: SelectOption[];
  isDuoTitle?: boolean;
  onPrimaryChange: (value: string) => void;
  onSecondaryChange?: (value: string) => void;
};

function TitleVoteCard({
  title,
  primaryValue,
  secondaryValue = "",
  primaryOptions,
  secondaryOptions,
  isDuoTitle = false,
  onPrimaryChange,
  onSecondaryChange,
}: TitleVoteCardProps) {
  const isAnswered = isDuoTitle
    ? Boolean(primaryValue) && Boolean(secondaryValue)
    : Boolean(primaryValue);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            Farewell title
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{title.title_name}</h3>
        </div>
        {isAnswered ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Selected
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            Optional
          </span>
        )}
      </div>

      <div className="space-y-4">
        <SearchableSelect
          label={isDuoTitle ? "Person 1" : "Select a classmate"}
          placeholder="Search and choose a student"
          value={primaryValue}
          options={primaryOptions}
          onChange={onPrimaryChange}
          helperText="Each student can only be used once per submission"
          clearLabel="Skip this title"
        />

        {isDuoTitle ? (
          <SearchableSelect
            label="Person 2"
            placeholder="Search and choose a second student"
            value={secondaryValue}
            options={secondaryOptions ?? primaryOptions}
            onChange={onSecondaryChange ?? (() => undefined)}
            helperText="Choose a different partner for this pair"
            clearLabel="Clear person 2"
          />
        ) : null}
      </div>
    </div>
  );
}

export default TitleVoteCard;
