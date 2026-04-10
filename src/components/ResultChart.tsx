import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AggregatedVote } from "../types";

type ResultChartProps = {
  result: AggregatedVote;
};

function ResultChart({ result }: ResultChartProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{result.titleName}</h3>
          <p className="mt-1 text-sm text-slate-500">{result.totalVotes} total votes cast</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
          <p className="text-slate-400">{result.titleType === "duo" ? "Leading duo" : "Winner"}</p>
          <p className="mt-1 font-semibold text-slate-900">
            {result.winner ? `${result.winner.name} (${result.winner.count})` : "No votes yet"}
          </p>
        </div>
      </div>

      {result.chartData.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          No votes submitted for this title yet.
        </div>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chartData} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={124}
                tick={{ fontSize: 12, fill: "#475569" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(79, 110, 247, 0.06)" }}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 12px 30px -20px rgba(15, 23, 42, 0.35)",
                }}
              />
              <Bar dataKey="votes" radius={[0, 14, 14, 0]} fill="#4f6ef7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ResultChart;
