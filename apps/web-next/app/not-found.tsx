import { AppButton, AppCard } from "@laboratoire/ui";

export default function NotFoundPage() {
  // Global 404. The root layout is now a bare `.app-shell`, so this page owns its
  // own `.app-main` content column (booking-demo pages get theirs from the group
  // layout; this fallback can render for any unmatched path).
  return (
    <main className="app-main">
      <AppCard>
        <h1>Page not found</h1>
        <p className="notice">
          The requested route does not exist in this demo. If you came from a
          confirmation link, the in-memory order state may have expired.
        </p>
        <div className="button-row">
          {/* `as="a"` renders the v3 button-styled anchor (full nav, MVP-fine). */}
          <AppButton as="a" href="/browse">
            Back to listing
          </AppButton>
        </div>
      </AppCard>
    </main>
  );
}
