import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/Field";
import { ErrorBox, Loading, PageCard } from "@/components/States";
import { supabase } from "@/integrations/supabase/client";
import { membersQuery } from "@/lib/queries";
import { fieldErrors, loanSchema } from "@/lib/validation";

export const Route = createFileRoute("/_authenticated/loans/new")({
  head: () => ({
    meta: [
      { title: "Add Loan — City Library" },
      { name: "description", content: "Record a new book loan for a member." },
      { property: "og:title", content: "Add Loan — City Library" },
      { property: "og:description", content: "Record a new book loan for a member." },
    ],
  }),
  component: AddLoan,
});

const today = () => new Date().toISOString().slice(0, 10);
const empty = () => ({ borrowerId: "", bookTitle: "", author: "", borrowedAt: today(), dueDate: "", notes: "" });

function AddLoan() {
  const queryClient = useQueryClient();
  const members = useQuery(membersQuery);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof ReturnType<typeof empty>, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = loanSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    const d = parsed.data;
    const { error } = await supabase.from("loans").insert({
      borrower_id: d.borrowerId,
      book_title: d.bookTitle,
      author: d.author,
      borrowed_at: d.borrowedAt,
      due_date: d.dueDate,
      notes: d.notes || null,
    });
    setBusy(false);
    if (error) return toast.error("Could not save the loan. Please try again.");
    toast.success(`Loan saved: "${d.bookTitle}"`);
    setForm(empty());
    queryClient.invalidateQueries();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageCard>
        <h1 className="text-3xl font-bold text-primary">Add Loan</h1>
        <p className="mt-1 text-sm text-muted-foreground">Record that a member borrowed a book.</p>
        {members.isLoading ? (
          <Loading label="Loading members..." />
        ) : members.error ? (
          <div className="mt-6"><ErrorBox message="Could not load members. Please refresh the page." /></div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
            <div className="sm:col-span-2">
              <Field id="borrowerId" label="Member" error={errors.borrowerId}>
                <select
                  id="borrowerId"
                  value={form.borrowerId}
                  onChange={(e) => set("borrowerId", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Choose a member...</option>
                  {members.data?.map((m) => (
                    <option key={m.id} value={m.id}>{m.full_name} ({m.email})</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field id="bookTitle" label="Book title" error={errors.bookTitle}>
              <Input id="bookTitle" value={form.bookTitle} onChange={(e) => set("bookTitle", e.target.value)} />
            </Field>
            <Field id="author" label="Author" error={errors.author}>
              <Input id="author" value={form.author} onChange={(e) => set("author", e.target.value)} />
            </Field>
            <Field id="borrowedAt" label="Borrow date" error={errors.borrowedAt}>
              <Input id="borrowedAt" type="date" value={form.borrowedAt} onChange={(e) => set("borrowedAt", e.target.value)} />
            </Field>
            <Field id="dueDate" label="Due date" error={errors.dueDate}>
              <Input id="dueDate" type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Field id="notes" label="Notes (optional)" error={errors.notes}>
                <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="gold" size="lg" disabled={busy}>
                {busy ? "Saving..." : "Save loan"}
              </Button>
            </div>
          </form>
        )}
      </PageCard>
    </div>
  );
}
