import { strapi } from "@strapi/client";
import { draftMode } from "next/headers";

const token = process.env.STRAPI_API_TOKEN?.trim();

export const strapiClient = strapi({
  baseURL: process.env.STRAPI_API_URL || "http://localhost:1337/api",
  ...(token ? { auth: token } : {}),
});

export async function getDraftStatus(): Promise<"draft" | "published"> {
  try {
    const draft = await draftMode();
    return draft.isEnabled ? "draft" : "published";
  } catch {
    return "published";
  }
}
