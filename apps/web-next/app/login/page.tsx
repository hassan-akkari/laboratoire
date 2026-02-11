import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE, sanitizeNextPath } from "../../lib/session";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function extractNext(searchParams: Record<string, string | string[] | undefined>) {
  const raw = searchParams.next;
  if (Array.isArray(raw)) {
    return raw[0];
  }

  return raw;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(extractNext(params));

  async function continueToCheckout(formData: FormData) {
    "use server";

    const requestedNext = formData.get("next");
    const destination =
      typeof requestedNext === "string"
        ? sanitizeNextPath(requestedNext)
        : "/checkout";

    const cookieStore = await cookies();
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: SESSION_COOKIE_VALUE,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 6,
    });

    redirect(destination);
  }

  return (
    <section className="layout-two">
      <article className="card">
        <h1>Login required</h1>
        <p className="section-subtitle">
          Checkout is protected to show a realistic auth gate and redirect flow.
        </p>
        <p className="notice">
          Demo mode: click continue and we set a short-lived secure cookie for this
          browser session.
        </p>
        <form action={continueToCheckout} className="form-grid">
          <input type="hidden" name="next" value={nextPath} />
          <button type="submit" className="button">
            Continue to checkout
          </button>
        </form>
        <div className="button-row">
          <Link href="/" className="button button--bordered">
            Back to listing
          </Link>
        </div>
      </article>

      <article className="card">
        <h2>Auth behavior</h2>
        <ul className="list">
          <li>Unauthenticated access to checkout redirects to this page.</li>
          <li>After login, user returns to original path via next query param.</li>
          <li>Cookie is HTTP-only and expires automatically.</li>
        </ul>
      </article>
    </section>
  );
}
