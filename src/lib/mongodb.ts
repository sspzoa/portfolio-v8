import { MongoClient, Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined")
}

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb
  }

  try {
    await client.connect()
    const db = client.db("portfolio")
    cachedDb = db
    return db
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

export interface TranslationCache {
  _id?: string
  contentType:
    | "aboutme"
    | "awards"
    | "certificates"
    | "experiences"
    | "projects"
  itemId: string
  language: string
  originalHash: string
  translatedData: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export async function getTranslationFromCache(
  contentType:
    | "aboutme"
    | "awards"
    | "certificates"
    | "experiences"
    | "projects",
  itemId: string,
  language: string,
  originalHash: string
): Promise<Record<string, unknown> | null> {
  const db = await connectToDatabase()
  const collection = db.collection<TranslationCache>("translationCache")

  const cached = await collection.findOne({
    contentType,
    itemId,
    language,
    originalHash,
  })

  return cached?.translatedData || null
}

export async function saveTranslationToCache(
  contentType:
    | "aboutme"
    | "awards"
    | "certificates"
    | "experiences"
    | "projects",
  itemId: string,
  language: string,
  originalHash: string,
  translatedData: Record<string, unknown>
): Promise<void> {
  const db = await connectToDatabase()
  const collection = db.collection<TranslationCache>("translationCache")

  await collection.replaceOne(
    {
      contentType,
      itemId,
      language,
    },
    {
      contentType,
      itemId,
      language,
      originalHash,
      translatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { upsert: true }
  )
}
