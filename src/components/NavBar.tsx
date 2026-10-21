import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { displayName, useAuth } from "@/hooks/use-auth";

const links = [
  { to: "/", label: "Home" },
  { to: "/loans/new", label: "Add Loan" },
  { to: "/members", label: "Members" },
] as const;

export function NavBar() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  async function logout() {
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("You have been logged out");
    navigate({ to: "/login", replace: true });
  }

  const linkCls =
    "rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground";
  const activeCls = "bg-primary-foreground/10 text-gold";

  return (
    <header className="bg-primary text-primary-foreground shadow-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-semibold">
          <BookOpen className="h-6 w-6 text-gold" /> City Library
        </Link>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
        <div
          className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-14 z-20 flex-col gap-2 bg-primary px-4 pb-4 md:static md:flex md:flex-1 md:flex-row md:items-center md:justify-between md:p-0`}
        >
          <nav className="flex flex-col gap-1 md:flex-row md:pl-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={linkCls}
                activeProps={{ className: activeCls }}
                activeOptions={{ exact: l.to === "/" }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {loading ? null : session ? (
              <>
                <span className="text-sm text-primary-foreground/85">
                  Hi, <strong className="text-gold">{displayName(session)}</strong>
                </span>
                <Button variant="gold" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="nav" size="sm" asChild>
                  <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                </Button>
                <Button variant="gold" size="sm" asChild>
                  <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
