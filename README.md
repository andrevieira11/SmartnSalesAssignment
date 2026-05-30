# SmartnSales Task Board

A mini-Trello for store operations: HQ creates projects, assigns tasks to regional managers, and tracks them across a **To Do / In Progress / Done** Kanban board. Built for the smartNsales full-stack challenge.

**Author:** André Vieira · andre.pa.vieira@gmail.com · GitHub [@andrevieira11](https://github.com/andrevieira11)

---

## Quick start

You only need **Docker Desktop**. One command brings up the whole stack (Next.js, Django, Postgres, nginx) and seeds demo data.

```bash
git clone <this-repo> smartnsales && cd smartnsales
cp .env.example .env
docker compose up --build
```

Then open **http://localhost:8080** and sign in with the seeded account:

```
username: demo
password: demo12345
```

(Or click “Create one” to register your own account — you’re logged straight in.)

### Running the tests

```bash
# Backend — pytest inside the api container
docker compose exec backend pytest

# Frontend — Vitest + React Testing Library
docker compose run --rm --entrypoint sh frontend -c "npm install && npm test"
```

---

## What’s inside

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind only |
| Backend | Django 5 + DRF, SimpleJWT, drf-spectacular |
| Database | PostgreSQL 15 |
| Proxy | nginx — `/api/*` → Django, everything else → Next |
| Bonus | Dashboard (totals, by-status, overdue, due-this-week) |

API docs (Swagger) live at **http://localhost:8080/api/docs**.

---

## Architecture & the decisions behind it

```
browser ──▶ nginx :8080 ──┬─ /api/*  ──▶ Django (gunicorn) ──▶ Postgres
                          └─ /*      ──▶ Next.js (standalone)
```

**Monorepo, clean split.** `backend/` (Django apps: `accounts`, `projects`, `tasks`, `dashboard`) and `frontend/` (Next App Router) are independent and each has its own Dockerfile. nginx is the single public entrypoint so the browser talks to one origin.

**Auth lives in httpOnly cookies, not localStorage.** Login/refresh set `access_token` and `refresh_token` as `HttpOnly` cookies, so client JS can never read them — that closes the usual XSS token-theft hole. A custom `CookieJWTAuthentication` class reads the access token from the cookie instead of the `Authorization` header. Because cookies are sent automatically, I added a **double-submit CSRF** guard: login also sets a *readable* `csrf_token` cookie, and every mutating request must echo it back in an `X-CSRF-Token` header (a cross-site attacker can ride the cookie but can’t read it to set the header). Refresh tokens **rotate and blacklist** on use, so a stolen refresh token dies after one use.

**Server components load data, client components handle interaction.** The board, task detail, and dashboard are server-rendered — the page arrives with data, not an empty spinner. Server components reach Django container-to-container (`INTERNAL_API_URL`) and forward the user’s cookies; the browser hits Django through nginx (`/api`). Forms, modals, and the slide-over are the only `'use client'` islands, and mutations call back through a small client helper that attaches the CSRF header and retries once through a token refresh on a 401.

**Permissions are enforced by the queryset.** You only ever see projects you own or tasks assigned to you — anything else returns **404**, not 403, so the API never leaks that a record exists. Project owners get full CRUD; an assignee can read their task and move it across columns (`PATCH status`) but can’t reassign or delete it.

**Reusable-first frontend.** Shared primitives (`Button`, `FormField`, `DatePicker`, `StatusBadge`, `PriorityTag`, `Modal`, `SlideOver`, `Avatar`) are composed by thin pages; no file exceeds ~200 lines. The date picker is a thin wrapper over the native `<input type="date">` — no component library, per the brief.

### Project layout

```
backend/    Django + DRF (accounts, projects, tasks, dashboard) · pytest suite
frontend/   Next 14 App Router · components/ui + components/board · lib/ data layer
nginx/      reverse-proxy config
docker-compose.yml · .env.example
```

---

## Tests

- **Backend (6, pytest):** model defaults, login sets an httpOnly cookie, anonymous access is rejected (401), permission isolation (owner `200` vs other-user `404`; assignee can PATCH status but `403` on edit/delete), status-filter + CRUD status codes, and refresh-rotation invalidating a reused token.
- **Frontend (2, Vitest + RTL):** a Kanban column renders its cards, and the auth form submits credentials and navigates on success.

They focus on the cookie-auth and permission paths because that’s where bugs would actually hurt.

---

## What I’d improve with more time

- **Silent token refresh on the server side.** Right now a server-component fetch that hits an expired access token redirects to login; I’d add a transparent refresh so the 15-minute expiry is invisible.
- **Drag-and-drop** between columns with optimistic UI — I shipped status-change-to-move first because it’s reliable and keyboard-accessible; DnD was the bonus I deliberately skipped to keep the MVP polished.
- **Pagination on the board.** The board fetches a project’s tasks in one page (fine for the demo); large projects need infinite scroll or page controls.
- **A real user directory / invitations** instead of exposing all usernames for the assignee picker.
- **CI** (GitHub Actions running pytest + vitest) and a few end-to-end tests with Playwright.

---

## Notes for reviewers

- Secrets come from `.env` (see `.env.example`); nothing sensitive is committed.
- Cookies use `Secure=false` for local HTTP — flip `AUTH_COOKIE_SECURE=true` (and serve HTTPS) in production. `ALLOWED_HOSTS` / `CSRF_TRUSTED_ORIGINS` are env-driven.
- Same-origin via nginx means no CORS is needed; I left `django-cors-headers` out on purpose.
