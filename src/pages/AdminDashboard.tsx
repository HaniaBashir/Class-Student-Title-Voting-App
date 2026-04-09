import { LogOut, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import ResultChart from "../components/ResultChart";
import StatsCard from "../components/StatsCard";
import { TITLES } from "../data/constants";
import { supabase } from "../lib/supabase";
import type { AggregatedVote, Title } from "../types";
import { aggregateVotes, isAdminAuthenticated } from "../utils/admin";

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [voteCount, setVoteCount] = useState(0);
  const [results, setResults] = useState<AggregatedVote[]>([]);

  async function loadDashboard() {
    setLoading(true);
    setError(null);

    const titlesFallback: Title[] = TITLES.map((title_name, index) => ({
      id: `fallback-title-${index + 1}`,
      title_name,
      display_order: index + 1,
    }));

    const [titlesResponse, submissionsResponse, votesCountResponse, votesResponse] = await Promise.all([
      supabase.from("titles").select("id, title_name, display_order").order("display_order"),
      supabase.from("submissions").select("*", { count: "exact", head: true }),
      supabase.from("submission_votes").select("*", { count: "exact", head: true }),
      supabase
        .from("submission_votes")
        .select("title_id, selected_student_name, titles(title_name, display_order)"),
    ]);

    const titles = titlesResponse.data?.length ? titlesResponse.data : titlesFallback;
    setSubmissionCount(submissionsResponse.count ?? 0);
    setVoteCount(votesCountResponse.count ?? 0);

    if (
      titlesResponse.error ||
      submissionsResponse.error ||
      votesCountResponse.error ||
      votesResponse.error
    ) {
      setError("Some live analytics could not be loaded. Check your Supabase schema and policies.");
    }

    setResults(aggregateVotes(titles, votesResponse.data ?? []));
    setLoading(false);
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("farewell_admin_ok");
    navigate("/admin");
  }

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="space-y-6">
      <div className="section-shell p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
              Admin dashboard
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Live farewell voting results
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              This dashboard is intentionally simple for a class project. In a real deployment,
              admin analytics should be protected with proper Supabase auth and server-side checks.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" onClick={() => void loadDashboard()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          label="Total voters submitted"
          value={submissionCount}
          helper="Unique student submissions recorded"
        />
        <StatsCard
          label="Total votes cast"
          value={voteCount}
          helper="Only non-skipped title selections count"
        />
        <StatsCard
          label="Average titles answered"
          value={submissionCount > 0 ? (voteCount / submissionCount).toFixed(1) : "0.0"}
          helper="Helpful for participation quality"
        />
      </div>

      {results.every((result) => result.totalVotes === 0) ? (
        <EmptyState
          title="No results yet"
          description="Votes will appear here as soon as students start submitting the form."
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {results.map((result) => (
            <ResultChart key={result.titleId} result={result} />
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
