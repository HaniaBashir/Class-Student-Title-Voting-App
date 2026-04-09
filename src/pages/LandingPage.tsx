import { ArrowRight, ShieldCheck, Vote } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

function LandingPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="section-shell overflow-hidden p-8 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-slate-400">
            Senior Farewell Experience
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Class Farewell Titles Voting
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Vote honestly for the classmates who best match each title. You may skip any
            title if unsure.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/vote">
              <Button className="w-full sm:w-auto">
                Start Voting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-slate-500">
              Each student can submit only once.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <Vote className="h-8 w-8 text-accent-500" />
          <h3 className="mt-5 text-xl font-semibold text-slate-900">Thoughtful voting flow</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Searchable class lists, optional titles, progress tracking, and a clean review step
            before final submission.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <ShieldCheck className="h-8 w-8 text-emerald-500" />
          <h3 className="mt-5 text-xl font-semibold text-slate-900">Simple but controlled</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Votes are stored in Supabase with one submission per voter name for a straightforward
            class project deployment.
          </p>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
