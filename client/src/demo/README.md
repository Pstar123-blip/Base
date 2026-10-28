# Example UI

This folder contains the replaceable layout, dashboard, and their UI components.
Authentication and the essential sign-in, unauthorized, and not-found pages live in `core/`.

When starting a project:

1. Replace the demo imports and route registrations in `../app/router.tsx` with your own layout and pages.
2. Delete this `demo/` folder.

Keep the root route and its `requireSession` hook: they protect your replacement routes automatically.
Shared loading and error states remain in `shared/ui/` because core pages use them.
