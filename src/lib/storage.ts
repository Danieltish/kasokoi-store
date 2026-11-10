const DEFAULT_BUCKET = "product-images";

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export class StorageError extends Error {}

type StorageConfig = {
  url: string;
  key: string;
  bucket: string;
};

function getConfig(): StorageConfig | null {
  const url = (
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  )
    .trim()
    .replace(/\/+$/, "");
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  const bucket = (process.env.SUPABASE_STORAGE_BUCKET ?? DEFAULT_BUCKET).trim();

  if (!url || !key) {
    return null;
  }

  return { url, key, bucket };
}

function requireConfig(): StorageConfig {
  const config = getConfig();

  if (!config) {
    throw new StorageError(
      "Image storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment.",
    );
  }

  return config;
}

function authHeaders(config: StorageConfig) {
  return {
    apikey: config.key,
    Authorization: `Bearer ${config.key}`,
  };
}

let bucketPromise: Promise<void> | null = null;

async function ensureBucket(config: StorageConfig) {
  if (!bucketPromise) {
    bucketPromise = (async () => {
      const response = await fetch(`${config.url}/storage/v1/bucket`, {
        method: "POST",
        headers: {
          ...authHeaders(config),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: config.bucket,
          name: config.bucket,
          public: true,
        }),
      });

      if (response.ok) {
        return;
      }

      const body = await response.text().catch(() => "");

      if (response.status === 409 || /already exists/i.test(body)) {
        return;
      }

      throw new StorageError("Could not prepare the image storage bucket.");
    })().catch((error) => {
      bucketPromise = null;
      throw error;
    });
  }

  return bucketPromise;
}

export async function uploadProductImage(file: File) {
  const config = requireConfig();
  const extension = MIME_EXTENSIONS[file.type];

  if (!extension) {
    throw new StorageError(
      "Unsupported image format. Use JPG, PNG, WebP, GIF or AVIF.",
    );
  }

  if (file.size <= 0) {
    throw new StorageError("The selected image is empty.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new StorageError("Each image must be 8 MB or smaller.");
  }

  await ensureBucket(config);

  const folder = new Date().toISOString().slice(0, 7);
  const path = `products/${folder}/${crypto.randomUUID()}.${extension}`;

  const response = await fetch(
    `${config.url}/storage/v1/object/${config.bucket}/${path}`,
    {
      method: "POST",
      headers: {
        ...authHeaders(config),
        "Content-Type": file.type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
      body: await file.arrayBuffer(),
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("Supabase storage upload failed", response.status, body);

    throw new StorageError("Could not upload the image. Please try again.");
  }

  return {
    url: `${config.url}/storage/v1/object/public/${config.bucket}/${path}`,
    path,
  };
}

export async function deleteStorageImage(imageUrl: string) {
  const config = getConfig();

  if (!config) {
    return;
  }

  const marker = `/storage/v1/object/public/${config.bucket}/`;
  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) {
    return;
  }

  const path = decodeURIComponent(
    imageUrl.slice(markerIndex + marker.length),
  );

  try {
    const response = await fetch(
      `${config.url}/storage/v1/object/${config.bucket}/${encodeURI(path)}`,
      {
        method: "DELETE",
        headers: authHeaders(config),
      },
    );

    if (!response.ok && response.status !== 404) {
      console.error(
        "Supabase storage delete failed",
        response.status,
        await response.text().catch(() => ""),
      );
    }
  } catch (error) {
    console.error("Supabase storage delete failed", error);
  }
}

export async function deleteStorageImages(imageUrls: string[]) {
  await Promise.allSettled(imageUrls.map((url) => deleteStorageImage(url)));
}
