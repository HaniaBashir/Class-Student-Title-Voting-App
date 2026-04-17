import { Pencil, Plus, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import AdminConfirmModal from "../components/AdminConfirmModal";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import SelectField from "../components/SelectField";
import TextField from "../components/TextField";
import { supabase } from "../lib/supabase";
import type { Title, TitleType } from "../types";

type TitleFormState = {
  title_name: string;
  display_order: string;
  title_type: TitleType;
};

const initialForm: TitleFormState = {
  title_name: "",
  display_order: "",
  title_type: "single",
};

function AdminTitlesPage() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [form, setForm] = useState<TitleFormState>(initialForm);
  const [deleteTarget, setDeleteTarget] = useState<Title | null>(null);

  async function loadTitles() {
    setLoading(true);
    const response = await supabase
      .from("titles")
      .select("id, title_name, display_order, title_type")
      .order("display_order");

    if (response.error) {
      setError("Titles could not be loaded right now.");
    } else {
      setTitles((response.data ?? []) as Title[]);
      setError(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadTitles();
  }, []);

  function resetForm() {
    setEditingTitleId(null);
    setForm(initialForm);
  }

  function startEdit(title: Title) {
    setEditingTitleId(title.id);
    setForm({
      title_name: title.title_name,
      display_order: String(title.display_order),
      title_type: title.title_type,
    });
    setFeedback(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const titleName = form.title_name.trim();
    const displayOrder = Number(form.display_order);

    if (!titleName) {
      setError("Title name is required.");
      return;
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 1) {
      setError("Display order must be a positive whole number.");
      return;
    }

    setSaving(true);
    setError(null);
    setFeedback(null);

    const payload = {
      title_name: titleName,
      display_order: displayOrder,
      title_type: form.title_type,
    };

    const response = editingTitleId
      ? await supabase.from("titles").update(payload).eq("id", editingTitleId)
      : await supabase.from("titles").insert(payload);

    if (response.error) {
      setError(response.error.message);
    } else {
      setFeedback(editingTitleId ? "Title updated." : "Title added.");
      resetForm();
      await loadTitles();
    }

    setSaving(false);
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setSaving(true);
    const response = await supabase.from("titles").delete().eq("id", deleteTarget.id);

    if (response.error) {
      setError(response.error.message);
    } else {
      setFeedback(`Deleted "${deleteTarget.title_name}".`);
      setDeleteTarget(null);
      await loadTitles();
    }

    setSaving(false);
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="section-shell p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">Titles management</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950">
            {editingTitleId ? "Edit title" : "Add new title"}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Titles control the voting order and whether a card expects one student or a duo pair.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <TextField
              label="Title name"
              value={form.title_name}
              onChange={(event) => setForm((current) => ({ ...current, title_name: event.target.value }))}
              placeholder="Best Smile"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Display order"
                type="number"
                min="1"
                value={form.display_order}
                onChange={(event) =>
                  setForm((current) => ({ ...current, display_order: event.target.value }))
                }
                placeholder="1"
              />
              <SelectField
                label="Title type"
                value={form.title_type}
                onChange={(value) =>
                  setForm((current) => ({ ...current, title_type: value as TitleType }))
                }
                options={[
                  { label: "Single", value: "single" },
                  { label: "Duo", value: "duo" },
                ]}
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {feedback ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {feedback}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" disabled={saving}>
                <Plus className="mr-2 h-4 w-4" />
                {editingTitleId ? "Save changes" : "Add title"}
              </Button>
              {editingTitleId ? (
                <Button type="button" variant="secondary" onClick={resetForm} disabled={saving}>
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="section-shell overflow-hidden p-0">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <h3 className="text-2xl font-semibold text-slate-950">All titles</h3>
            <p className="mt-2 text-sm text-slate-600">{titles.length} configured titles</p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-slate-500">Loading titles...</div>
          ) : titles.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No titles yet"
                description="Add your first title to make the platform ready for a new class."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50/80 text-left text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium sm:px-8">Order</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium text-right sm:px-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {titles.map((title) => (
                    <tr key={title.id}>
                      <td className="px-6 py-4 font-medium text-slate-900 sm:px-8">{title.display_order}</td>
                      <td className="px-6 py-4 text-slate-700">{title.title_name}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                          {title.title_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 sm:px-8">
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="secondary" onClick={() => startEdit(title)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button type="button" variant="danger" onClick={() => setDeleteTarget(title)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete title?"
        description={
          deleteTarget
            ? `Deleting "${deleteTarget.title_name}" will also remove votes for that title because submission votes reference the title record.`
            : ""
        }
        confirmLabel="Delete title"
        tone="danger"
        busy={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}

export default AdminTitlesPage;
