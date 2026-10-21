<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Data is read/written from the browser via the generated Supabase client, with RLS as the security boundary; signed-in pages live under `src/routes/_authenticated/` (client-only gate redirecting to /login). Why: simple MVP with no server-only secrets.
- Profiles are created by a DB trigger on auth signup from `full_name` metadata. Why: the profile always exists even if the client fails after signup.
