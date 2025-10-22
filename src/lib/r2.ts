import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3"

if (!process.env.R2_ACCESS_KEY_ID) {
  throw new Error("R2_ACCESS_KEY_ID environment variable is not defined")
}

if (!process.env.R2_SECRET_ACCESS_KEY) {
  throw new Error("R2_SECRET_ACCESS_KEY environment variable is not defined")
}

if (!process.env.R2_ACCOUNT_ID) {
  throw new Error("R2_ACCOUNT_ID environment variable is not defined")
}

if (!process.env.R2_BUCKET_NAME) {
  throw new Error("R2_BUCKET_NAME environment variable is not defined")
}

if (!process.env.R2_PUBLIC_URL) {
  throw new Error("R2_PUBLIC_URL environment variable is not defined")
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

export async function uploadImageToR2(
  imageBuffer: Buffer,
  contentType: string = "image/png"
): Promise<string> {
  const key = `portfolio-images/${Date.now()}`

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: imageBuffer,
    ContentType: contentType,
  })

  try {
    await s3Client.send(command)
    return `${process.env.R2_PUBLIC_URL}/${key}`
  } catch (error) {
    throw new Error(
      `Failed to upload image to R2: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

export async function fetchImageFromNotion(url: string): Promise<{
  buffer: Buffer
  contentType: string
}> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Portfolio-Image-Sync/1.0)",
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`
    )
  }

  const buffer = await response.arrayBuffer()
  const contentType = response.headers.get("content-type") || "image/png"

  return {
    buffer: Buffer.from(buffer),
    contentType,
  }
}

export async function deleteR2Object(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  })

  try {
    await s3Client.send(command)
  } catch (error) {
    throw error
  }
}

export async function deleteAllPortfolioImages(): Promise<number> {
  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
    Prefix: "portfolio-images/",
  })

  try {
    const listResult = await s3Client.send(listCommand)

    if (!listResult.Contents || listResult.Contents.length === 0) {
      return 0
    }

    const objectsToDelete = listResult.Contents.filter(
      (object) => object.Key
    ).map((object) => ({ Key: object.Key! }))

    if (objectsToDelete.length === 0) {
      return 0
    }

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Delete: {
        Objects: objectsToDelete,
        Quiet: true,
      },
    })

    await s3Client.send(deleteCommand)
    return objectsToDelete.length
  } catch (error) {
    throw error
  }
}

export function extractR2KeyFromUrl(url: string): string | null {
  if (!url.includes(process.env.R2_PUBLIC_URL || "")) {
    return null
  }

  const parts = url.split("/")
  const keyIndex = parts.findIndex((part) => part === "portfolio-images")

  if (keyIndex === -1 || keyIndex + 1 >= parts.length) {
    return null
  }

  return `portfolio-images/${parts[keyIndex + 1]}`
}
