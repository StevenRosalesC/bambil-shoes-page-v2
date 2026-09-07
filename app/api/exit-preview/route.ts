import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const referer = request.headers.get("referer");

  let redirectUrl = searchParams.get("redirect");

  if (!redirectUrl && referer) {
    try {
      const parsedReferer = new URL(referer);
      redirectUrl = parsedReferer.pathname + parsedReferer.search;
    } catch {
      redirectUrl = "/";
    }
  }

  // Ensure redirectUrl is a relative path to avoid open redirects
  if (!redirectUrl || !redirectUrl.startsWith("/") || redirectUrl.startsWith("//")) {
    redirectUrl = "/";
  }

  const draft = await draftMode();
  draft.disable();

  redirect(redirectUrl);
}
