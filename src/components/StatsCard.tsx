type StatsCardProps = {
  label: string;
  value: string | number;
  helper: string;
};

function StatsCard({ label, value, helper }: StatsCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </div>
  );
}

export default StatsCard;
