import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/Field";
import { ErrorBox, PageCard } from "@/components/States";
import { supabase } from "@/integrations/supabase/client";
import { fieldErrors, registerSchema } from "@/lib/validation";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — City Library" },
      { name: "description", content: "Become a City Library member." },
      { property: "og:title", content: "Register — City Library" },
      { property: "og:description", content: "Become a City Library member." },
    ],
  }),
  component: Register,
});

const fields = [
  { key: "fullName", label: "Full name", type: "text", auto: "name" },
  { key: "email", label: "Email", type: "email", auto: "email" },
  { key: "password", label: "Password", type: "password", auto: "new-password" },
  { key: "confirmPassword", label: "Confirm password", type: "password", auto: "new-password" },
] as const;

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { full_name: parsed.data.fullName }, emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (error) {
      return setFormError(
        /already/i.test(error.message) ? "An account with this email already exists." : error.message,
      );
    }
    if (!data.session) {
      toast.success("Account created! Please log in.");
      return navigate({ to: "/login" });
    }
    toast.success("Welcome to City Library!");
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto max-w-md">
      <PageCard>
        <h1 className="text-3xl font-bold text-primary">Register</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create your member account.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {formError && <ErrorBox message={formError} />}
          {fields.map((f) => (
            <Field key={f.key} id={f.key} label={f.label} error={errors[f.key]}>
              <Input id={f.key} type={f.type} autoComplete={f.auto} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            </Field>
          ))}
          <Button type="submit" variant="gold" className="w-full" disabled={busy}>
            {busy ? "Creating account..." : "Register"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already a member? <Link to="/login" className="font-semibold text-primary underline">Login</Link>
          </p>
        </form>
      </PageCard>
    </div>
  );
}
