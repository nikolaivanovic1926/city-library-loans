import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookMarked, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBox, Loading } from "@/components/States";
import { displayName, useAuth } from "@/hooks/use-auth";
import { statsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "City Library — Book loans for members" },
      { name: "description", content: "Welcome to City Library. Members can record and browse book loans." },
      { property: "og:title", content: "City Library — Book loans for members" },
      { property: "og:description", content: "Welcome to City Library. Members can record and browse book loans." },
    ],
  }),
  component: Home,
});

function Home() {
  const { session, loading } = useAuth();
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-card p-8 text-center shadow-card sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Welcome</p>
        <h1 className="mt-2 text-4xl font-bold text-primary sm:text-5xl">City Library</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          {session
            ? `Good to see you, ${displayName(session)}. Record new loans and see who is reading what.`
            : "A cozy little place to keep track of who borrowed which book. Join as a member to get started."}
        </p>
        {loading ? (
          <Loading />
        ) : session ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="gold" size="lg" asChild><Link to="/loans/new">Add Loan</Link></Button>
            <Button variant="outline" size="lg" asChild><Link to="/members">Members</Link></Button>
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="gold" size="lg" asChild><Link to="/login">Login</Link></Button>
            <Button variant="outline" size="lg" asChild><Link to="/register">Register</Link></Button>
          </div>
        )}
      </section>
      {session && <Stats />}
    </div>
  );
}

function Stats() {
  const { data, isLoading, error } = useQuery(statsQuery);
  if (isLoading) return <Loading label="Loading statistics..." />;
  if (error || !data) return <ErrorBox message="Could not load statistics. Please refresh the page." />;
  const items = [
    { label: "Members", value: data.members, icon: Users },
    { label: "Loans", value: data.loans, icon: BookMarked },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-4 rounded-2xl bg-card p-6 shadow-card">
          <div className="rounded-xl bg-accent p-3 text-primary"><i.icon className="h-6 w-6" /></div>
          <div>
            <p className="font-serif text-3xl font-bold text-primary">{i.value}</p>
            <p className="text-sm text-muted-foreground">{i.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
