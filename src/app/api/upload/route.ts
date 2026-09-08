import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import {
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
  r2,
} from "@/lib/r2";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ALLOWED_FOLDERS = [
  "products",
  "campaigns",
  "categories",
  "collections",
] as const;

function getFileExtension(file: File) {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (!extension) {
    return "jpg";
  }

  return extension;
}

function createFileName(file: File) {
  const extension = getFileExtension(file);

  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const timestamp = Date.now();
  const randomId = crypto.randomUUID();

  return `${timestamp}-${randomId}-${safeName || "image"}.${extension}`;
}

function isAllowedFolder(
  folder: string
): folder is (typeof ALLOWED_FOLDERS)[number] {
  return ALLOWED_FOLDERS.includes(
    folder as (typeof ALLOWED_FOLDERS)[number]
  );
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();

    const file = formData.get("file");

    const requestedFolder =
      formData.get("folder")?.toString() ??
      "products";

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image file was provided.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, and WebP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: "The selected image is empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Image must be smaller than 10 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const folder = requestedFolder
      .toLowerCase()
      .trim();

    if (!isAllowedFolder(folder)) {
      return NextResponse.json(
        {
          error: "Invalid upload folder.",
        },
        {
          status: 400,
        }
      );
    }

    const fileName = createFileName(file);

    const key = `${folder}/${fileName}`;

    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: file.type,

        CacheControl:
          "public, max-age=31536000, immutable",
      })
    );

    const baseUrl = R2_PUBLIC_URL.replace(
      /\/$/,
      ""
    );

    if (!baseUrl) {
      throw new Error(
        "Missing CLOUDFLARE_R2_PUBLIC_URL."
      );
    }

    const url = `${baseUrl}/${key}`;

    return NextResponse.json(
      {
        success: true,

        url,

        key,

        name: file.name,

        size: file.size,

        type: file.type,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "R2 upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to upload the image.",
      },
      {
        status: 500,
      }
    );
  }
}