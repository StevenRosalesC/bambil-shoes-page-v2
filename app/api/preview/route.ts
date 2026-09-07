import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/";

  const previewSecret =
    process.env.PREVIEW_SECRET || "bambil_preview_secret_key_2026";

  if (!secret || secret !== previewSecret) {
    return new Response("Token de previsualización inválido", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(slug);
}
