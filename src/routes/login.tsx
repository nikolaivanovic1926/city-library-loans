import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/Field";
import { ErrorBox, PageCard } from "@/components/States";
import { supabase } from "@/integrations/supabase/client";
import { fieldErrors, loginSchema } from "@/lib/validation";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — City Library" },
      { name: "description", content: "Log in to your City Library member account." },
      { property: "og:title", content: "Login — City Library" },
      { property: "og:description", content: "Log in to your City Library member account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) return setFormError("Login failed: wrong email or password.");
    toast.success("Welcome back!");
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto max-w-md">
      <PageCard>
        <h1 className="text-3xl font-bold text-primary">Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in with your member account.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {formError && <ErrorBox message={formError} />}
          <Field id="email" label="Email" error={errors.email}>
            <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field id="password" label="Password" error={errors.password}>
            <Input id="password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Button type="submit" variant="gold" className="w-full" disabled={busy}>
            {busy ? "Logging in..." : "Login"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            No account yet? <Link to="/register" className="font-semibold text-primary underline">Register</Link>
          </p>
        </form>
      </PageCard>
    </div>
  );
}
