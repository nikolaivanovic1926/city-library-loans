import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBox, Loading, PageCard } from "@/components/States";
import { formatDate, memberQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/members/$id")({
  head: () => ({
    meta: [
      { title: "Member details — City Library" },
      { name: "description", content: "Books borrowed by a City Library member." },
      { property: "og:title", content: "Member details — City Library" },
      { property: "og:description", content: "Books borrowed by a City Library member." },
    ],
  }),
  component: MemberDetails,
});

function MemberDetails() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery(memberQuery(id));

  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" asChild>
        <Link to="/members"><ArrowLeft className="h-4 w-4" /> Back to members</Link>
      </Button>
      <PageCard>
        {isLoading ? (
          <Loading label="Loading member..." />
        ) : error || !data ? (
          <ErrorBox message="Could not load this member. Please refresh the page." />
        ) : !data.profile ? (
          <p className="text-muted-foreground">Member not found.</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-primary">{data.profile.full_name}</h1>
            <p className="text-muted-foreground">{data.profile.email}</p>
            <h2 className="mt-8 text-xl font-semibold text-primary">Borrowed books</h2>
            {data.loans.length === 0 ? (
              <p className="mt-3 text-muted-foreground">No books borrowed yet</p>
            ) : (
              <div className="mt-3 grid gap-3">
                {data.loans.map((l) => (
                  <div key={l.id} className="rounded-xl border border-border bg-background/60 p-4">
                    <p className="font-serif text-lg font-semibold">{l.book_title}</p>
                    <p className="text-sm text-muted-foreground">by {l.author}</p>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <span>Borrowed: <strong>{formatDate(l.borrowed_at)}</strong></span>
                      <span>Due: <strong className="text-primary">{formatDate(l.due_date)}</strong></span>
                    </div>
                    {l.notes && <p className="mt-2 text-sm italic text-muted-foreground">{l.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </PageCard>
    </div>
  );
}
