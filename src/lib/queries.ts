import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const statsQuery = queryOptions({
  queryKey: ["stats"],
  queryFn: async () => {
    const [m, l] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("loans").select("id", { count: "exact", head: true }),
    ]);
    if (m.error) throw m.error;
    if (l.error) throw l.error;
    return { members: m.count ?? 0, loans: l.count ?? 0 };
  },
});

export const membersQuery = queryOptions({
  queryKey: ["members"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, loans(count)")
      .order("full_name");
    if (error) throw error;
    return data.map((p) => ({
      id: p.id,
      full_name: p.full_name,
      email: p.email,
      loanCount: (p.loans as unknown as { count: number }[])[0]?.count ?? 0,
    }));
  },
});

export const memberQuery = (id: string) =>
  queryOptions({
    queryKey: ["member", id],
    queryFn: async () => {
      const [p, l] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email").eq("id", id).maybeSingle(),
        supabase
          .from("loans")
          .select("id, book_title, author, borrowed_at, due_date, notes")
          .eq("borrower_id", id)
          .order("borrowed_at", { ascending: false }),
      ]);
      if (p.error) throw p.error;
      if (l.error) throw l.error;
      return { profile: p.data, loans: l.data };
    },
  });

export function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
