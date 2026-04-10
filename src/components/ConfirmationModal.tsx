import Button from "./Button";

type ConfirmationModalProps = {
  open: boolean;
  voterName: string;
  voterRollNumber?: string;
  answeredCount: number;
  totalTitles: number;
  onCancel: () => void;
  onConfirm: () => void;
  submitting?: boolean;
};

function ConfirmationModal({
  open,
  voterName,
  voterRollNumber,
  answeredCount,
  totalTitles,
  onCancel,
  onConfirm,
  submitting,
}: ConfirmationModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/80 bg-white p-6 shadow-soft sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
          Confirm submission
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">Ready to submit your vote?</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          You are submitting as <span className="font-semibold text-slate-900">{voterName}</span>.
          {voterRollNumber ? (
            <>
              {" "}
              <span className="text-slate-500">({voterRollNumber})</span>.
            </>
          ) : (
            "."
          )}{" "}
          You answered {answeredCount} out of {totalTitles} titles. This password will be marked as used after a successful submission.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={submitting}>
            Go back
          </Button>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting ? "Submitting..." : "Confirm and submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
