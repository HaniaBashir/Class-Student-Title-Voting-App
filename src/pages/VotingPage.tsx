import { AlertCircle, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ConfirmationModal from "../components/ConfirmationModal";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchableSelect from "../components/SearchableSelect";
import TitleVoteCard from "../components/TitleVoteCard";
import { useVotingData } from "../hooks/useVotingData";
import { supabase } from "../lib/supabase";
import type { SelectOption, VoteSelections } from "../types";
import {
  buildInitialSelections,
  countAnsweredTitles,
  getDisabledStudentValues,
} from "../utils/voting";

const EMPTY_RESULTS_ERROR_CODE = "PGRST116";

type ValidatedVoter = {
  credentialId: string;
  rollNumber: string;
  studentName: string;
};

function VotingPage() {
  const navigate = useNavigate();
  const { students, titles, loading, error } = useVotingData();
  const [voterRollNumber, setVoterRollNumber] = useState("");
  const [voterPassword, setVoterPassword] = useState("");
  const [validatedVoter, setValidatedVoter] = useState<ValidatedVoter | null>(null);
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
  const studentLookup = useMemo(
    () => new Map(students.map((student) => [student.roll_number, student])),
    [students],
  );
  const voterOptions: SelectOption[] = useMemo(
    () =>
      students.map((student) => ({
        value: student.roll_number,
        label: `${student.roll_number} — ${student.name}`,
      })),
    [students],
  );

  function handleTitleChange(
    titleId: string,
    field: "primary" | "secondary",
    studentRollNumber: string,
  ) {
    setSelections((current) => ({
      ...current,
      [titleId]: {
        ...current[titleId],
        [field]: studentRollNumber,
      },
    }));
  }

  function handleRollNumberChange(value: string) {
    setVoterRollNumber(value.toUpperCase());
    setValidatedVoter(null);
  }

  function handlePasswordChange(value: string) {
    setVoterPassword(value);
    setValidatedVoter(null);
  }

  function resetForm() {
    setVoterRollNumber("");
    setVoterPassword("");
    setValidatedVoter(null);
    setSelections(buildInitialSelections(titles));
    setFeedback(null);
    setModalOpen(false);
  }

  function getIncompleteDuoTitles() {
    return titles
      .filter((title) => selections[title.id]?.isDuo)
      .filter((title) => {
        const selection = selections[title.id];
        return Boolean(selection?.primary) !== Boolean(selection?.secondary);
      })
      .map((title) => title.title_name);
  }

  function getDuplicatedDuoTitles() {
    return titles
      .filter((title) => selections[title.id]?.isDuo)
      .filter((title) => {
        const selection = selections[title.id];
        return Boolean(selection?.primary) && selection?.primary === selection?.secondary;
      })
      .map((title) => title.title_name);
  }

  function getSelfVoteTitles(voterRoll: string) {
    return titles
      .filter((title) => {
        const selection = selections[title.id];
        return selection?.primary === voterRoll || selection?.secondary === voterRoll;
      })
      .map((title) => title.title_name);
  }

  async function rollbackSubmission(submissionId: string) {
    await supabase.from("submissions").delete().eq("id", submissionId);
  }

  async function validateVoterCredentials() {
    const rollNumber = voterRollNumber.trim();
    const password = voterPassword.trim();

    const credentialMatch = await supabase
      .from("voter_credentials")
      .select("id, roll_number, student_name, is_used")
      .eq("roll_number", rollNumber)
      .eq("voter_password", password)
      .maybeSingle();

    if (credentialMatch.error && credentialMatch.error.code !== EMPTY_RESULTS_ERROR_CODE) {
      setFeedback({
        type: "error",
        message: "We could not verify your voting credentials right now. Please try again.",
      });
      return null;
    }

    if (!credentialMatch.data) {
      const credentialByRoll = await supabase
        .from("voter_credentials")
        .select("id, roll_number, student_name, is_used")
        .eq("roll_number", rollNumber)
        .maybeSingle();

      if (credentialByRoll.error && credentialByRoll.error.code !== EMPTY_RESULTS_ERROR_CODE) {
        setFeedback({
          type: "error",
          message: "We could not verify your voting credentials right now. Please try again.",
        });
        return null;
      }

      if (!credentialByRoll.data) {
        setFeedback({
          type: "error",
          message: "No voter credentials were found for this roll number.",
        });
        return null;
      }

      if (credentialByRoll.data.is_used) {
        setFeedback({
          type: "error",
          message: "This roll number has already used its voting password.",
        });
        return null;
      }

      setFeedback({
        type: "error",
        message: "The password does not match this roll number.",
      });
      return null;
    }

    if (credentialMatch.data.is_used) {
      setFeedback({
        type: "error",
        message: "This roll number has already used its voting password.",
      });
      return null;
    }

    return {
      credentialId: credentialMatch.data.id,
      rollNumber: credentialMatch.data.roll_number,
      studentName: credentialMatch.data.student_name,
    } satisfies ValidatedVoter;
  }

  async function prepareSubmission() {
    if (!voterRollNumber.trim()) {
      setFeedback({ type: "error", message: "Please select your roll number before submitting." });
      return;
    }

    if (!voterPassword.trim()) {
      setFeedback({ type: "error", message: "Please enter your voting password." });
      return;
    }

    const incompleteDuoTitles = getIncompleteDuoTitles();
    if (incompleteDuoTitles.length > 0) {
      setFeedback({
        type: "error",
        message: `Complete both names for ${incompleteDuoTitles.join(", ")} before submitting.`,
      });
      return;
    }

    const duplicatedDuoTitles = getDuplicatedDuoTitles();
    if (duplicatedDuoTitles.length > 0) {
      setFeedback({
        type: "error",
        message: `Choose two different students for ${duplicatedDuoTitles.join(", ")}.`,
      });
      return;
    }

    setFeedback(null);

    const validated = await validateVoterCredentials();
    if (!validated) {
      setValidatedVoter(null);
      return;
    }

    const selfVoteTitles = getSelfVoteTitles(validated.rollNumber);
    if (selfVoteTitles.length > 0) {
      setValidatedVoter(validated);
      setFeedback({
        type: "error",
        message: `Self voting is not allowed. Remove yourself from ${selfVoteTitles.join(", ")}.`,
      });
      return;
    }

    setValidatedVoter(validated);
    setFeedback({
      type: "success",
      message: `Validated as ${validated.studentName} (${validated.rollNumber}). Review and confirm your submission.`,
    });
    setModalOpen(true);
  }

  async function submitVotes() {
    if (!validatedVoter) {
      setFeedback({
        type: "error",
        message: "Please validate your roll number and password before submitting.",
      });
      setModalOpen(false);
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const duplicateCheck = await supabase
      .from("submissions")
      .select("id")
      .eq("roll_number", validatedVoter.rollNumber)
      .maybeSingle();

    if (duplicateCheck.data) {
      setFeedback({ type: "error", message: "This roll number has already submitted a vote." });
      setSubmitting(false);
      setModalOpen(false);
      return;
    }

    if (duplicateCheck.error && duplicateCheck.error.code !== EMPTY_RESULTS_ERROR_CODE) {
      setFeedback({
        type: "error",
        message: "We could not verify your submission status right now. Please try again.",
      });
      setSubmitting(false);
      setModalOpen(false);
      return;
    }

    const voteRows = Object.entries(selections)
      .filter(([, selection]) =>
        selection.isDuo
          ? Boolean(selection.primary) && Boolean(selection.secondary)
          : Boolean(selection.primary),
      )
      .map(([titleId, selection]) => ({
        titleId,
        selection,
        primaryStudent: studentLookup.get(selection.primary),
        secondaryStudent: selection.secondary ? studentLookup.get(selection.secondary) : null,
      }));

    if (
      voteRows.some(
        (row) => !row.primaryStudent || (row.selection.isDuo && !row.secondaryStudent),
      )
    ) {
      setFeedback({
        type: "error",
        message: "One or more selected students could not be resolved. Please refresh and try again.",
      });
      setSubmitting(false);
      setModalOpen(false);
      return;
    }

    const submissionResponse = await supabase
      .from("submissions")
      .insert({
        roll_number: validatedVoter.rollNumber,
        student_name: validatedVoter.studentName,
      })
      .select("id")
      .single();

    if (submissionResponse.error) {
      setFeedback({
        type: "error",
        message:
          submissionResponse.error.code === "23505"
            ? "This roll number has already submitted a vote."
            : "Something went wrong while saving your submission. Please try again.",
      });
      setSubmitting(false);
      setModalOpen(false);
      return;
    }

    if (voteRows.length > 0) {
      const votesResponse = await supabase.from("submission_votes").insert(
        voteRows.map((row) => ({
          submission_id: submissionResponse.data.id,
          title_id: row.titleId,
          selected_student_name: row.primaryStudent!.name,
          selected_student_name_2: row.selection.isDuo ? row.secondaryStudent!.name : null,
        })),
      );

      if (votesResponse.error) {
        await rollbackSubmission(submissionResponse.data.id);
        setFeedback({
          type: "error",
          message: "Your submission could not be completed. Please try again.",
        });
        setSubmitting(false);
        setModalOpen(false);
        return;
      }
    }

    const credentialUpdate = await supabase
      .from("voter_credentials")
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq("id", validatedVoter.credentialId)
      .eq("is_used", false)
      .select("id")
      .maybeSingle();

    if (credentialUpdate.error || !credentialUpdate.data) {
      await rollbackSubmission(submissionResponse.data.id);
      setFeedback({
        type: "error",
        message: "Your submission could not be finalized. Please try again.",
      });
      setSubmitting(false);
      setModalOpen(false);
      return;
    }

    setSubmitting(false);
    navigate("/success", { state: { voterName: validatedVoter.studentName, answeredCount } });
  }

  function buildOptions(
    disabledValues: Set<string>,
    currentTitleId: string,
    currentField: "primary" | "secondary",
  ) {
    const currentValue = selections[currentTitleId]?.[currentField] ?? "";

    return students.map<SelectOption>((student) => {
      const isSelf = validatedVoter?.rollNumber === student.roll_number;
      const isDisabled =
        (disabledValues.has(student.roll_number) && currentValue !== student.roll_number) || isSelf;

      return {
        value: student.roll_number,
        label: `${student.name} (${student.roll_number})`,
        disabled: isDisabled,
        description: isSelf ? "Self vote blocked" : isDisabled ? "Selected already" : undefined,
      };
    });
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
              Log in with your roll number and password, then assign classmates to each title. All
              titles are optional, but self voting is not allowed.
            </p>

            <div className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
              <SearchableSelect
                label="Roll number"
                placeholder="Search and select your roll number"
                value={voterRollNumber}
                options={voterOptions}
                onChange={handleRollNumberChange}
                helperText="Select your roll number from the class list"
              />

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label className="text-sm font-medium text-slate-800">Voting password</label>
                  <span className="text-xs text-slate-400">One-time password per student</span>
                </div>
                <input
                  type="password"
                  value={voterPassword}
                  onChange={(event) => handlePasswordChange(event.target.value)}
                  placeholder="Enter your assigned password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-accent-500/10"
                />
              </div>

              {validatedVoter ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Validated student: <span className="font-semibold">{validatedVoter.studentName}</span>{" "}
                  <span className="text-emerald-700">({validatedVoter.rollNumber})</span>
                </div>
              ) : null}
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
                <p className="mt-2 text-base font-medium text-slate-900">One vote per roll number</p>
                <p className="mt-1 text-sm text-slate-500">
                  Roll number and password must match before your vote is accepted.
                </p>
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
                onClick={() => void prepareSubmission()}
                disabled={!voterRollNumber.trim() || !voterPassword.trim() || submitting}
                className="sm:ml-auto"
              >
                Review submission
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {titles.map((title) => {
            const selection = selections[title.id];
            const primaryDisabledStudents = getDisabledStudentValues(selections, title.id, "primary");
            const secondaryDisabledStudents = getDisabledStudentValues(
              selections,
              title.id,
              "secondary",
            );

            return (
              <TitleVoteCard
                key={title.id}
                title={title}
                primaryValue={selection?.primary ?? ""}
                secondaryValue={selection?.secondary ?? ""}
                primaryOptions={buildOptions(primaryDisabledStudents, title.id, "primary")}
                secondaryOptions={buildOptions(secondaryDisabledStudents, title.id, "secondary")}
                isDuoTitle={selection?.isDuo ?? false}
                onPrimaryChange={(studentRoll) => handleTitleChange(title.id, "primary", studentRoll)}
                onSecondaryChange={(studentRoll) =>
                  handleTitleChange(title.id, "secondary", studentRoll)
                }
              />
            );
          })}
        </div>
      </section>

      <ConfirmationModal
        open={modalOpen}
        voterName={validatedVoter?.studentName ?? "Validated voter"}
        voterRollNumber={validatedVoter?.rollNumber}
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
