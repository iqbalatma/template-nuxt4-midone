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

This is presentation only. The API gates every route itself; a hidden entry is
a courtesy, never the security boundary. Add a `permission` to a menu entry only
if the API actually gates that route on it, or the menu offers a screen that
answers 403.

## WebSockets

Three read-only feeds: `/api/notifications/ws`, `/api/management/audits/ws`,
`/api/management/job-logs/ws`.

**The access token does not work on them.** A browser handshake cannot set an
Authorization header, so the token travels in the query string — and the web
access token is bound to the httpOnly `access_token_verifier` cookie, which the
WS routes deliberately do not read. Mint a short-lived one with
`useAuthService().wsToken()` (`POST /api/auth/ws-token`); the API refuses that
token everywhere else.

- `useNotificationSocket` — opened once from `app/layouts/default.vue`, which
  only mounts for authenticated pages. It also handles the `permissions.changed`
  control frame by re-running `fetchMe`, so a role change reaches the menu
  without a reload. Control frames carry an `event` key; a notification never
  does.
- `useLiveFeed` — the generic one behind the audits and job-runs pages, with a
  `paused` flag so a reader can freeze incoming rows without dropping the socket.

Both reconnect on a fixed delay and stop when `wsToken()` returns null, which
means the session is gone and retrying would loop.

Live rows are only prepended on the **unfiltered first page**. Anywhere else the
row does not belong in what is on screen, and inserting it shows a page that
contradicts its own pagination.

## Server-side lists

Page state lives in the URL, so a filtered view can be linked to and survives a
reload. The pattern:

```ts
watch(() => route.query, fetchThings, { immediate: true, deep: true })
```

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
- `app/utils/faker.ts` still backs the dashboard demo widgets. The notification
  dropdown no longer uses it.
