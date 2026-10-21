import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ErrorBox, Loading, PageCard } from "@/components/States";
import { membersQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/members/")({
  head: () => ({
    meta: [
      { title: "Members — City Library" },
      { name: "description", content: "All registered City Library members and their loans." },
      { property: "og:title", content: "Members — City Library" },
      { property: "og:description", content: "All registered City Library members and their loans." },
    ],
  }),
  component: Members,
});

function Members() {
  const { data, isLoading, error } = useQuery(membersQuery);
  return (
    <PageCard>
      <h1 className="text-3xl font-bold text-primary">Members</h1>
      <p className="mt-1 text-sm text-muted-foreground">Everyone registered at City Library.</p>
      <div className="mt-6">
        {isLoading ? (
          <Loading label="Loading members..." />
        ) : error || !data ? (
          <ErrorBox message="Could not load members. Please refresh the page." />
        ) : data.length === 0 ? (
          <p className="text-muted-foreground">No members yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((m) => (
              <li key={m.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link to="/members/$id" params={{ id: m.id }} className="font-serif text-lg font-semibold text-primary hover:underline">
                    {m.full_name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{m.email}</p>
                </div>
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {m.loanCount} {m.loanCount === 1 ? "book" : "books"} borrowed
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageCard>
  );
}
