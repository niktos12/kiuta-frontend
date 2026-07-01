import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB raw
const MAX_BASE64_SIZE = 500 * 1024; // 500 KB as base64 (~375 KB raw)

function getImageMimeBase(type: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "image/jpeg",
    "image/png": "image/png",
    "image/webp": "image/webp",
    "image/gif": "image/gif",
  };
  return map[type] || "image/png";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, GIF are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2 MB." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = buffer.toString("base64");
    const mime = getImageMimeBase(file.type);
    const dataUrl = `data:${mime};base64,${base64}`;

    if (dataUrl.length > MAX_BASE64_SIZE) {
      return NextResponse.json(
        {
          error:
            "Image is too large after encoding. Try a smaller image (under ~375 KB).",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 },
    );
  }
}
