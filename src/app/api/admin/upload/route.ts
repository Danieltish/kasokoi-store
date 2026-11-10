import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { StorageError, uploadProductImage } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Could not read the uploaded file." },
      { status: 400 },
    );
  }

  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "Choose at least one image to upload." },
      { status: 400 },
    );
  }

  try {
    const images = [];

    for (const file of files) {
      images.push(await uploadProductImage(file));
    }

    return NextResponse.json({ images });
  } catch (error) {
    if (error instanceof StorageError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Image upload failed", error);

    return NextResponse.json(
      { error: "Could not upload the image. Please try again." },
      { status: 500 },
    );
  }
}
