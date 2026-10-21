# City Library Loans

Hi! I want to build a small web app called "City Library" for tracking book loans. Please build the whole thing in one go and don't ask me questions, just make reasonable choices where something is not clear. It's a school project (an MVP), so it should be simple but everything has to really work.

The idea: people register as library members and log in. Logged in members can record that someone borrowed a book, see all members, and click on a member to see which books that member borrowed.

Users:
- Visitor (not logged in): sees only Home, Login and Register.
- Member (logged in): can add a loan, see all members, open a member's details and log out.

Pages (React, with a navigation bar on every page):
1. Home - short welcome text. Visitors see Login and Register buttons. Logged in users see how many members and how many loans there are, and buttons for Add Loan and Members.
2. Register - full name, email, password, confirm password. Validate the fields and show clear error messages.
3. Login - email and password, show an error if login fails.
4. Add Loan - a form with: member (dropdown of all registered members), book title, author, borrow date, due date, notes (optional). On save, store it in the database and show a success message, then clear the form.
5. Members - a separate page that lists all registered members from the database (name, email, number of borrowed books). Each name is a link.
6. Member Details at /members/:id - shows the member's name and email and a list of all books this member borrowed (title, author, borrow date, due date). Include a back button. If there are no books show "No books borrowed yet".

Navigation: Home, Add Loan, Members in the menu. On the right: Login and Register for visitors, and the user's name plus Logout for logged in users. If a visitor opens a protected page, redirect to Login. After login go to Home.

Backend: use Supabase with email and password auth (register, login, logout). Email confirmation is turned off, so users can log in right after registering.

Tables:
- profiles: id (same as auth user id), full_name, email, created_at. Create the profile automatically when a user registers, using the full name from the register form.
- loans: id, borrower_id (references profiles.id), book_title, author, borrowed_at (date), due_date (date), notes (optional), created_at.
Enable Row Level Security: logged in users can read all profiles and all loans, and can insert loans. Visitors can't read anything.

Also: loading and error states everywhere, toast messages after saving, and no errors in the browser console.

Look and feel: warm library style. Cream background, deep green as the main color, soft gold for buttons and highlights, white cards with rounded corners and light shadows. Serif font for headings, clean sans-serif for text. Responsive for mobile and desktop.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b6082e5e-87c3-49d7-9b84-7ef0f82eb51d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
