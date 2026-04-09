import { CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/Button";

type LocationState = {
  voterName?: string;
  answeredCount?: number;
};

function SuccessPage() {
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

  return (
    <section className="mx-auto max-w-2xl">
      <div className="section-shell p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
          Vote submitted successfully
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          {state?.voterName
            ? `${state.voterName}, your farewell voting form has been recorded.`
            : "Your farewell voting form has been recorded."}
          {" "}
          {typeof state?.answeredCount === "number"
            ? `You answered ${state.answeredCount} titles.`
            : "Thank you for participating."}
        </p>

        <div className="mt-8">
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SuccessPage;
