import type { SelectOption, Title } from "../types";
import SearchableSelect from "./SearchableSelect";

type TitleVoteCardProps = {
  title: Title;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

function TitleVoteCard({ title, value, options, onChange }: TitleVoteCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            Farewell title
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{title.title_name}</h3>
        </div>
        {value ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Selected
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            Optional
          </span>
        )}
      </div>

      <SearchableSelect
        label="Select a classmate"
        placeholder="Search and choose a student"
        value={value}
        options={options}
        onChange={onChange}
        helperText="Each student can only be used once per submission"
        clearLabel="Skip this title"
      />
    </div>
  );
}

export default TitleVoteCard;
