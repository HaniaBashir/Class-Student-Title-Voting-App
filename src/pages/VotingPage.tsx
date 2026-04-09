import { AlertCircle, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ConfirmationModal from "../components/ConfirmationModal";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchableSelect from "../components/SearchableSelect";
import TitleVoteCard from "../components/TitleVoteCard";
import { useVotingData } from "../hooks/useVotingData";
import { supabase } from "../lib/supabase";
import type { SelectOption, VoteSelections } from "../types";
import { buildInitialSelections, countAnsweredTitles, getDisabledStudentNames } from "../utils/voting";

function VotingPage() {
  const navigate = useNavigate();
  const { students, titles, loading, error } = useVotingData();
  const [voterName, setVoterName] = useState("");
  const [selections, setSelections] = useState<VoteSelections>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(
    null,
  );

  useEffect(() => {
    if (titles.length && Object.keys(selections).length === 0) {
      setSelections(buildInitialSelections(titles));
    }
  }, [titles, selections]);

  const answeredCount = countAnsweredTitles(selections);
  const voterOptions: SelectOption[] = students.map((student) => ({
    value: student.name,
    label: student.name,
  }));

  function handleTitleChange(titleId: string, studentName: string) {
    setSelections((current) => ({
      ...current,
      [titleId]: studentName,
    }));
  }

  function resetForm() {
    setVoterName("");
    setSelections(buildInitialSelections(titles));
    setFeedback(null);
  }

  async function submitVotes() {
    if (!voterName) {
      setFeedback({ type: "error", message: "Please select your own name before submitting." });
      setModalOpen(false);
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const duplicateCheck = await supabase
      .from("submissions")
      .select("id")
      .eq("voter_name", voterName)
      .maybeSingle();

    if (duplicateCheck.data) {
      setFeedback({ type: "error", message: "You have already submitted your vote." });
      setSubmitting(false);
      setModalOpen(false);
      return;
    }

    if (duplicateCheck.error && duplicateCheck.error.code !== "PGRST116") {
      setFeedback({
        type: "error",
        message: "We could not verify your submission status right now. Please try again.",
      });
      setSubmitting(false);
      return;
    }

    const submissionResponse = await supabase
      .from("submissions")
      .insert({ voter_name: voterName })
      .select("id")
      .single();

    if (submissionResponse.error) {
      setFeedback({
        type: "error",
        message:
          submissionResponse.error.code === "23505"
            ? "You have already submitted your vote."
            : "Something went wrong while saving your submission. Please try again.",
      });
      setSubmitting(false);
      setModalOpen(false);
      return;
    }

    const voteRows = Object.entries(selections)
      .filter(([, studentName]) => Boolean(studentName))
      .map(([titleId, studentName]) => ({
        submission_id: submissionResponse.data.id,
        title_id: titleId,
        selected_student_name: studentName,
      }));

    if (voteRows.length > 0) {
      const votesResponse = await supabase.from("submission_votes").insert(voteRows);

      if (votesResponse.error) {
        await supabase.from("submissions").delete().eq("id", submissionResponse.data.id);
        setFeedback({
          type: "error",
          message: "Your submission could not be completed. Please try again.",
        });
        setSubmitting(false);
        setModalOpen(false);
        return;
      }
    }

    setSubmitting(false);
    navigate("/success", { state: { voterName, answeredCount } });
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="section-shell p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
              Voting form
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Choose thoughtfully
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Pick the classmates who best fit each farewell title. You can skip any title, and
              each classmate can only be selected once in your submission.
            </p>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
              <SearchableSelect
                label="Your name"
                placeholder="Search and select your name"
                value={voterName}
                options={voterOptions}
                onChange={setVoterName}
                helperText="Used to prevent duplicate submissions"
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
                <p className="text-sm text-slate-500">Titles answered</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {answeredCount}/{titles.length}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
                <p className="text-sm text-slate-500">Submission policy</p>
                <p className="mt-2 text-base font-medium text-slate-900">One vote per student</p>
                <p className="mt-1 text-sm text-slate-500">Duplicate voter names are blocked.</p>
              </div>
            </div>

            {error ? (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            ) : null}

            {feedback ? (
              <div
                className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                  feedback.type === "error"
                    ? "border border-rose-200 bg-rose-50 text-rose-700"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {feedback.message}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" onClick={resetForm}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset form
              </Button>
              <Button
                onClick={() => setModalOpen(true)}
                disabled={!voterName || submitting}
                className="sm:ml-auto"
              >
                Submit votes
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {titles.map((title) => {
            const disabledStudents = getDisabledStudentNames(selections, title.id);
            const options: SelectOption[] = students.map((student) => ({
              value: student.name,
              label: student.name,
              disabled: disabledStudents.has(student.name),
              description: disabledStudents.has(student.name) ? "Selected already" : undefined,
            }));

            return (
              <TitleVoteCard
                key={title.id}
                title={title}
                value={selections[title.id] ?? ""}
                options={options}
                onChange={(studentName) => handleTitleChange(title.id, studentName)}
              />
            );
          })}
        </div>
      </section>

      <ConfirmationModal
        open={modalOpen}
        voterName={voterName}
        answeredCount={answeredCount}
        totalTitles={titles.length}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => void submitVotes()}
        submitting={submitting}
      />
    </>
  );
}

export default VotingPage;
