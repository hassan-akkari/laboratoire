import { AppButton, AppCard } from "@laboratoire/ui";

export default function NotFoundPage() {
  return (
    <AppCard>
      <h1>Page not found</h1>
      <p className="notice">
        The requested route does not exist in this demo. If you came from a
        confirmation link, the in-memory order state may have expired.
      </p>
      <div className="button-row">
        {/* `as="a"` renders the v3 button-styled anchor (full nav, MVP-fine). */}
        <AppButton as="a" href="/">
          Back to listing
        </AppButton>
      </div>
    </AppCard>
  );
}
