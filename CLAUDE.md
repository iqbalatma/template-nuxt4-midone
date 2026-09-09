# template-nuxt4-midone

Nuxt 4 SPA (`ssr: false`) on the Midone admin theme, paired with
[`template-go-api`](../template-go-api). Pinia for state, Tailwind v4.

Read that repo's CLAUDE.md too — the response envelope, permission names and
WebSocket rules described here are its contract, and the two have to move
together.

## Layout

```
app/base/       theme primitives (ui kit, side/top menu, dropdowns)
app/themes/     four interchangeable layouts, all fed from app/main/side-menu.ts
app/components/ app-level shared components
app/services/   one composable per API resource — the only place $api is called
app/stores/     pinia stores (auth, notification, flash, theme)
app/composables/ cross-cutting behaviour (live feeds, menu filtering)
app/types/      response envelope + entity shapes mirroring the Go resources
app/enums/      Permission and ResponseCode, mirroring the Go enums
i18n/locales/   translations, one file per domain per locale
```

## Talking to the API

Everything goes through `$api` (`app/plugins/api.ts`). It attaches the bearer
token, sends cookies, refreshes once on a 401 and parks concurrent requests
while that refresh is in flight.

**Only a token failure ends the session.** `ERR_AUTHENTICATION` (401) triggers
`forceLogout`; `ERR_ACTION_UNAUTHORIZED` is the API's **403** — authenticated
but lacking a permission — and must not. Logging someone out because they
opened one forbidden screen strands them on `/auth` with a perfectly good
session. This is keyed on the response `code`, not the status.

Services never render errors themselves: the plugin already pushed the
message into the flash store. A service catch returns `false` (or an empty
list) so the caller can decide what to do.

### Response envelope

```ts
{ code, message, status_code, timestamp, payload: { data, meta? } }
```

`ResponseError` adds `errors` (per-field, from the binding layer) and `debug`,
which is only present when the API runs with `APP_DEBUG=true`. Never render
`debug` outside a developer view.

## Permissions

`/api/me` is the only endpoint returning `permissions` — a flattened list across
every role. `useAuthService().fetchMe()` fills it, and the store persists it to
`localStorage` so a reload draws the right menu before the request resolves.

**Login must be followed by `fetchMe`.** `authenticate` returns a profile with
no roles or permissions; without the follow-up the user lands on a dashboard
with every gated menu entry hidden until the next full page load.

`useAuthorizedMenu` filters `app/main/side-menu.ts` by the `permission` on each
entry and drops group labels left with nothing under them. It is wired into
`app/base/side-menu` and `app/base/top-menu` — one place each, so all four
themes get it.

`useBreadcrumb` reads the same file: it matches the current path against each
`route_name` and returns `[group label, ...titles]` as i18n keys, so a renamed
or moved menu entry moves the breadcrumb with it. The leaf comes from
`section-menu.ts` when the path is one of its entries, because the side menu
only names the shell above it. All eight theme headers (four themes x side/top)
render it; none of them holds a list of its own. A path in neither list falls
back to its own segments.

This is presentation only. The API gates every route itself; a hidden entry is
a courtesy, never the security boundary. Add a `permission` to a menu entry only
if the API actually gates that route on it, or the menu offers a screen that
answers 403.

## WebSockets

Four read-only feeds: `/api/notifications/ws`, `/api/management/audits/ws`,
`/api/management/job-logs/ws` and `/api/management/queue/ws`.

**The access token does not work on them.** A browser handshake cannot set an
Authorization header, so the token travels in the query string — and the web
access token is bound to the httpOnly `access_token_verifier` cookie, which the
WS routes deliberately do not read. Mint a short-lived one with
`useAuthService().wsToken()` (`POST /api/auth/ws-token`); the API refuses that
token everywhere else.

`NotificationBell` draws the bell and its unread count (capped at `9+`). Use it
in a header rather than a bare `<Lucide icon="Bell">` — six of the eight theme
headers used to draw the plain icon, so most themes showed no unread marker at
all. The count is `unreadCount` from the store, which is the API's own number
(`GET /api/notifications/unread-count`), not `items.filter(...)`: an unread
notification older than the loaded page still has to light up the bell.

- `useNotificationSocket` — opened once from `app/layouts/default.vue`, which
  only mounts for authenticated pages. It also handles the `permissions.changed`
  control frame by re-running `fetchMe`, so a role change reaches the menu
  without a reload. Control frames carry an `event` key; a notification never
  does.
- `useLiveFeed` — the generic one behind the audits, job-runs and queue pages,
  with a `paused` flag so a reader can freeze incoming rows without dropping the
  socket.

The queue feed is the odd one: `job-logs/ws` carries a *finished attempt*, so a
job that is dispatched and then waits never appears on it, while `queue/ws`
carries every transition — dispatched, claimed, settled. That means a frame is
usually an update to a row already on screen, so `LiveQueueFeed` removes the
existing row by id before prepending. Appending blindly shows the same job three
times.

Both reconnect on a fixed delay and stop when `wsToken()` returns null, which
means the session is gone and retrying would loop.

A row rendered in both a table and its live panel takes its badge variants from
`app/utils/badge.ts` — `httpStatusVariant`, `httpMethodVariant`,
`jobStatusVariant`. They started as a copy in each file and drifted, so the same
request read green in one and grey in the other.

**Live rows never enter the paginated table.** A row prepended into a filtered
or non-first page contradicts its own pagination, and one arriving under the
cursor moves what someone is reading. They go into a side panel instead
(`LiveActivityFeed`, `LiveJobRunFeed`): its own service instance, its own
socket, always the newest unfiltered rows, capped at 15. The table stays
whatever the URL asked for until the reader changes it.

## Shell pages

Three of them: `/account` (users, roles, permissions), `/system` (activity log,
jobs dashboard, queue, schedules, job runs, cache) and `/profile` (own details,
own password). Each is one side-menu entry. `app/pages/account.vue` and
`app/pages/system.vue` are the parent routes: they render `SectionNav`
(left-hand nav + `<NuxtPage/>`), and the matching `index.vue` redirects to the
first entry, since a shell has no content of its own.

The split is by audience, not by API prefix — `/account` is who may use the app,
`/system` is what the app has been doing. Both draw on `/api/management/*`.

The entries are real routes, not tabs. Each list keeps its own `?page=` /
`?search=` in the URL, and switching entry must not carry the other one's query
along.

`SectionNav` runs its menus through `useAuthorizedMenu` as well, on the same
grounds as the side menu: an entry that answers 403 is worse than one that isn't
there.

The lists live in `app/main/section-menu.ts` (`accountMenus`, `systemMenus`,
`profileMenus`)
rather than inside the shell components, because the quick search reads them
too — those sub-pages are most of what this app actually has, and
`side-menu.ts` only knows about the two shells above them. Adding a resource is
one entry there plus one page file in the shell's directory.

**A shell's side-menu `permission` is the one its landing page needs** — the
redirect goes there unconditionally, so gating the entry on anything else offers
a menu that lands on a 403.

The side menu names the shell (`route_name: 'system'`), not the pages under it,
so `useBreadcrumb` takes the shell from `side-menu.ts` and the leaf from
`section-menu.ts`.

`/profile` is a third shell with no side-menu entry at all: the account dropdown
is how it is reached, and its two entries (`profileMenus`) carry no permission —
the API takes the id from the token, so every authenticated user owns exactly
their own. `/profile/detail` edits the fields `PATCH /api/me` accepts, and
`/profile/password` posts to `PATCH /api/me/password`, which asks for the
current password and answers a wrong one as a field error rather than a 401 (see
the API's CLAUDE.md — a 401 there would trip `forceLogout`).

The avatar rides along with the detail form, which is why that one save goes out
as multipart when a file is picked and as plain JSON when it is not: the Go
handler binds either, and leaves the stored avatar alone when no file arrives.
The collection is single-file, max 2 MB, jpeg/png/webp; a rejected file comes
back as an `ERR_INVALID_ACTION` message, not a per-field error. Media URLs are
**root-relative and served by the API host**, so `useAuthUser().avatarUrl` puts
`apiBase` in front of the 150px `thumb` conversion. `components/UserAvatar.vue`
is the only thing that renders it, so all eight theme headers and the account
trigger show the picture at once.

## Background job screens

Four entries under `/system`, in the order you would use them: **Jobs**
(dashboard), **Queue**, **Schedules**, **Job Runs**. The dashboard is the one
that says whether anything is wrong; the other three are where you go once it
says something is.

They mirror `app/queue` and `app/scheduler` in the API — read that repo's
CLAUDE.md for what the numbers mean.

### The dashboard reads two endpoints, on purpose

`job-logs/stats` is how the work that already ran went; `queue/stats` is how
much is waiting now. Neither substitutes for the other — a queue can have a
perfect success rate and still be an hour behind — so `system/jobs.vue` fetches
both in one `Promise.all` and shows them as two labelled groups rather than one
undifferentiated row of numbers.

`success_rate` ignores skipped runs, so the tile's hint says how many were
skipped. It is tinted grey rather than red when the window has no runs at all: a
quiet night reports 0%, and colouring that as an outage cries wolf.

`oldest_pending_seconds` is the queue tile worth watching — it climbs the moment
workers stop, however many jobs are in the table. `delayed` is shown as a hint
under `pending` because a big pending number made of scheduled retries is not a
backlog.

Durations arrive as **fractional** milliseconds (most jobs finish in
microseconds). `formatDuration` renders anything under 1ms as `<1 ms` rather
than `0 ms`, which reads as "not measured".

### The chart

`JobTrendChart` remounts the canvas via `:key` on data *and* theme. The base
`Chart` component builds its chart once on mount and never watches its config,
and `getColor` reads CSS custom properties at construction — so without the
theme in the key, a chart built in light mode keeps light-mode colours after a
toggle.

The API fills empty buckets, so the chart must plot them: a sparse series hides
an outage by drawing the points either side next to each other.

### Destructive actions are confirmed and narrow

Retry and purge go through `ModalDelete`. A retry **re-runs the job from the
start** — the email is sent again, the API called again — so the confirmation
says that rather than asking a generic "are you sure". "Clear finished" purges
only `success` and `canceled`; failed rows are the list somebody still has to
act on, and a button that quietly took them too would delete the evidence.

`management.queue.manage` / `management.schedule.manage` gate every one of those
buttons, separately from the `*.index` permission that shows the list. A
read-only operator gets the board without the buttons.

### Schedules

The list is unpaginated because the API's is: one row per job registered in Go
code, which is a handful. There is no "create" — a schedule row exists only
because code registers the job.

"No next run" has three different causes and the page must not collapse them: an
unparseable expression (`cron_error`, a bug to fix), a disabled job (a choice),
and a valid expression that can never fire (neither). An invalid cron comes back
as a per-field error under the input rather than being saved, because a stored
bad expression makes the job silently stop running.

**Run now** works on a disabled job too — disabled means the clock will not
start it, not that an operator may not, and running it once by hand is how you
check it is safe to enable. The API answers "accepted", not "finished": the
outcome shows up on Job Runs a moment later, which is why the page refetches on
a delay instead of reading a result out of the response.

## Quick search

The navbar dialog (ctrl/cmd-K, `app/base/quick-search-dialog`). Two sections:

- **Pages** — `useSearchablePages` in `app/composables/useQuickSearch.ts`
  flattens `side-menu.ts` plus `section-menu.ts`, both through
  `useAuthorizedMenu`, so it offers only what the user may open. Matching is on
  the **translated** label, not the i18n key: searching in Indonesian, or for a
  word that lives only in the label ("Log" in "Activity Log"), finds nothing
  otherwise.
- **Users** — `GET /api/management/users?search=`, and only when the user holds
  `user.index`. It reuses the list endpoint rather than a search endpoint of its
  own: the permission gate is already on that route, and a second one would be a
  second place to keep right. Picking a result lands on
  `/account/users?search=<email>`, since there is no user detail page.

Adding a section means an API call that is already permission-gated; do not
invent an unauthenticated search endpoint to feed it.

## Forms and modals

Every required field in a form or modal carries a required mark next to its
label — `<RequiredMark />` (`app/components/RequiredMark.vue`), auto-imported
like the other app components:

```vue
<Label for="user-email">Email<RequiredMark /></Label>
```

One component, not a repeated inline `<span class="text-danger">*</span>`: the
mark is the same everywhere, and the day it changes (colour, glyph, a tooltip)
it changes in one file instead of every modal. It is `aria-hidden` — the real
requirement is enforced by the API and reported through `FormFeedback`, so the
mark is a visual cue only.

Mark a field only when the API actually rejects it as empty. A mark on an
optional field trains readers to ignore all of them.

A field that comes back with an error has to *look* wrong, not just carry a
message under it. Bind `aria-invalid` to the same key the `FormFeedback` uses:

```vue
<Input id="user-email" :aria-invalid="flashStore.isKeyErrors('email')" v-model="form.email" />
<FormFeedback feedbackKey="email" />
```

`input.styles.ts` / `textarea.styles.ts` already carry
`aria-invalid:border-danger` plus the ring, so no per-field colour class is
needed — and the state reaches screen readers instead of being colour only.
Every input with a `FormFeedback` gets the matching `aria-invalid`; the two are
keyed off the same field name, so they light up and clear together
(`flashStore.clearMessages()` on modal open resets both).

Every dropdown is `TomSelect` (`~/base/ui/tom-select`) — search, multi-select
and the styling all come with it, and one select widget across the app means a
reader learns it once. Do not reach for `NativeSelect` or a raw `<select>` for
new screens; a plain `<select>` looks nothing like the rest of the forms and
cannot do the multi-value case at all.

```vue
<TomSelect v-model="form.role_ids" :options="roleOptions" :multiple="true" placeholder="Select roles" />
```

It takes `{ id, name }` items and **emits strings**, its placeholder option
included — so a numeric value (the rows-per-page pickers in
`ServerSidePagination` / `ClientSidePagination`) converts on the way back out
and ignores an empty emit. On a URL-backed value, ignore an emit that matches
what is already selected too: the `modelValue` watcher re-sets the control after
the navigation, and that fires change a second time.

`NativeSelect` survives in exactly three places, all of them deliberate: its own
definition under `base/ui/native-select`, the `base/ui/usage` page that
documents it, and the datepicker's month/year pickers — those are the internals
of a calendar popover, where a searchable select would be both wrong and
broken. Everything a page renders is `TomSelect`.

`TomSelect` renders its own control, so `aria-invalid` on it does not reach
anything visible — show its error with `FormFeedback` alone.

Its options come from `/api/options/*`, never from the resource's own list
endpoint: `getAllOptions()` on `RoleService` / `PermissionService`, kept in
`roleOptionsCollection` / `permissionOptionsCollection` so a dropdown and a
table on the same page do not share one ref. Those endpoints answer to
`option.role.index` / `option.permission.index` — permissions of their own, so a
user form does not require handing out role management — which means the page
has to check before asking, the way `/account/users` and `/account/roles` do.
Call it unguarded and someone who may edit users but not read roles gets a 403
toast on a page that otherwise loaded.

The exception is the user picker on `/system/audits`, which still reads the
paginated `GET /api/management/users` (first 100, no search): there is no
`/api/options/users` yet, so that dropdown silently truncates past 100 users.

Every field carries a `placeholder` — an example of what belongs in it
(`name@example.com`, `Minimum 8 characters`), not a repeat of the label. An
optional field says so: `:placeholder="$t('account.users.form.optional')"`.
A `TomSelect` placeholder is what stands for "no choice yet", so it reads
`All roles` on a filter and `Select roles` on a form. Placeholders are i18n
keys like every other string.

The exception is `<Input type="date">` (and the other native pickers): the
browser draws its own hint and ignores `placeholder`, so those get an
`aria-label` instead — see the date range in `app/pages/system/audits.vue`.

## i18n

`@nuxtjs/i18n` with `strategy: 'no_prefix'` — the locale never enters the URL,
so every route stays a single path and no link has to know the reader's
language. `en` and `id`, English the default.

Files are `i18n/locales/<locale>/<domain>.json` and each one is listed on its
locale in `nuxt.config.ts`; a new file that is not listed there loads nothing
and every key in it renders as the key.

`detectBrowserLanguage` is off. `app/plugins/locale.client.ts` restores the
choice from `localStorage` instead — `setLocale` alone does not survive a
reload, and a browser header would override a choice the reader made by hand.

`LanguageSwitcher` sits in all eight theme menus (four themes x side/top) and
in `app/layouts/auth.vue` — it belongs to the auth shell rather than the
sign-in page, so forgot-password and reset-password get it too. The strings
on those pages are the `auth` domain; a switcher over hardcoded copy changes
nothing visible and reads as broken.

`definePageMeta({ title, pageSubTitle })` holds **i18n keys** too —
`app/themes/Layout.vue` resolves both with `t()` (page heading and `useHead`
title). A literal string still renders, since a missing key falls back to
itself, which is exactly how an untranslated page hides in plain sight.

Menu titles in `app/main/side-menu.ts`, `top-menu.ts` and `section-menu.ts` are
**i18n keys**, not text; `app/base/side-menu`, `app/base/top-menu` and
`SectionNav` resolve them with `$t`.
`i18n/locales.spec.ts` (`npm test`) fails when a menu names a key nothing
defines, or when `id` and `en` drift apart — a missing key renders as the raw
key, which no one notices until a reader switches language.

## List page toolbar

One row above the table: **actions on the left, filters on the right**.

```vue
<div class="mb-4 flex flex-wrap items-end justify-between gap-3">
  <Button v-if="canStore" @click="modalFormRef?.handleModal(true)">
    <Lucide icon="Plus" /> Add User
  </Button>

  <!-- filters here -->
</div>
```

`justify-between` does the split, so the row still reads right when the left
side is missing (no create permission) — the filters stay where the eye already
looks for them.

One or two filters sit inline. **Three or more go into `FilterPopover`**
(`app/components/FilterPopover.vue`) — a "Filter" button that opens a popover
holding the inputs, with a Reset in its `#footer` slot:

```vue
<FilterPopover :active="hasActiveFilters">
  <Input v-model="filters.search" placeholder="Search..." />
  <TomSelect v-model="filters.role_id" :options="roleOptions" placeholder="All roles" />
  <TomSelect v-model="filters.status" :options="statusOptions" placeholder="All statuses" />
  <template #footer>
    <Button look="outline" variant="ghost" size="sm" :disabled="!hasActiveFilters" @click="reset">
      Reset
    </Button>
  </template>
</FilterPopover>
```

Pass `:active` so the trigger carries a dot while anything is applied —
filters folded into a popover are invisible otherwise, and a reader who forgot
one blames the list for lying. Reference implementation: `ng-sales-web`
(`app/pages/partners/index.vue`).

## Server-side lists

Page state lives in the URL, so a filtered view can be linked to and survives a
reload. `useServerList` is the way in:

```ts
const { filters, hasActiveFilters, reset, refresh } = useServerList({
  filters: { search: '', status: '' },
  debounce: ['search'],
  fetch: (page, per_page, applied) => getAllPaginated({ page, per_page, ...applied }),
})
```

The URL is the single source of truth: inputs write to it, one watcher turns it
into a request. That is what makes a double fetch impossible — nothing syncs the
URL *and* calls the service side by side — and it keeps back/forward working.
`filters` is a local mirror so typing stays instant while the URL sync is
debounced; bind it with `v-model`, and call `refresh()` after a mutation.

Free-text and number inputs belong in `debounce`. Without it every keystroke is
a navigation and a request.

More than two filters go in a `FilterPopover` rather than a toolbar row — the
trigger shows a dot while any is applied, and its footer holds the reset button.

Pages written before this still hand-roll `watch(() => route.query, ...)`;
`/system/audits` and `/system/job-logs` are the converted ones.

`ServerSidePagination` drives `page`/`per_page` through the same query. Empty
filters are dropped rather than sent blank — the API treats a present-but-empty
value as a filter matching nothing.

`per_page` above 100 is rejected by the API (`utils.MaximumPerPage`), and a
non-numeric `page` comes back as a 400 with a per-field error rather than being
silently replaced.

## Gotchas

- `pages/auth/` is a directory, not `auth.vue` — `index`, `callback` (OAuth),
  `forgot-password` and `reset-password` all live under it.
- The OAuth callback receives only a token in the query string, so it calls
  `fetchMe` before navigating.
- Forgot-password shows the same confirmation whether or not the address exists.
  The API deliberately answers identically; a friendlier "no such account" here
  would put the enumeration back.
- Table cells are `whitespace-nowrap` by default (`base/ui/styles/table.styles.ts`),
  so one long value — an audit path, a job's error message — widens the whole
  table into a horizontal scroll instead of wrapping. Put `whitespace-normal` on
  that `<TD>` and `break-all`/`break-words` on the text inside it. `max-width` on
  the cell will not help: an auto-layout `<td>` ignores it.
- `app/utils/faker.ts` still backs the dashboard demo widgets. The notification
  dropdown no longer uses it.
