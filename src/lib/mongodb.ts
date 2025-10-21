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

export interface NotionCache {
  _id?: string
  contentType:
    | "aboutme"
    | "awards"
    | "certificates"
    | "experiences"
    | "projects"
    | "activities"
    | "skills"
  data: Record<string, unknown>[]
  createdAt: Date
  updatedAt: Date
}

export interface TranslationCache {
  _id?: string
  language: string
  originalHash: string
  translatedData: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export async function getTranslationFromCache(
  language: string,
  originalHash: string
): Promise<Record<string, unknown> | null> {
  const db = await connectToDatabase()
  const collection = db.collection<TranslationCache>("translationCache")

  const cached = await collection.findOne({
    language,
    originalHash,
  })

  return cached?.translatedData || null
}

export async function getGlobalTranslationFromCache(
  language: string
): Promise<Record<string, unknown> | null> {
  const db = await connectToDatabase()
  const collection = db.collection<TranslationCache>("translationCache")

  const cached = await collection.findOne({
    language,
  })

  return cached?.translatedData || null
}

export async function saveTranslationToCache(
  language: string,
  originalHash: string,
  translatedData: Record<string, unknown>
): Promise<void> {
  const db = await connectToDatabase()
  const collection = db.collection<TranslationCache>("translationCache")

  await collection.replaceOne(
    {
      language,
    },
    {
      language,
      originalHash,
      translatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { upsert: true }
  )
}

export async function getNotionCache(
  contentType:
    | "aboutme"
    | "awards"
    | "certificates"
    | "experiences"
    | "projects"
    | "activities"
    | "skills"
): Promise<Record<string, unknown>[] | null> {
  const db = await connectToDatabase()
  const collection = db.collection<NotionCache>("notionCache")

  const cached = await collection.findOne({
    contentType,
  })

  return cached?.data || null
}

export async function saveNotionCache(
  contentType:
    | "aboutme"
    | "awards"
    | "certificates"
    | "experiences"
    | "projects"
    | "activities"
    | "skills",
  data: Record<string, unknown>[]
): Promise<void> {
  const db = await connectToDatabase()
  const collection = db.collection<NotionCache>("notionCache")

  await collection.replaceOne(
    { contentType },
    {
      contentType,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { upsert: true }
  )
}

export async function getAllNotionData(): Promise<{
  aboutme: Record<string, unknown>[]
  awards: Record<string, unknown>[]
  certificates: Record<string, unknown>[]
  experiences: Record<string, unknown>[]
  projects: Record<string, unknown>[]
  activities: Record<string, unknown>[]
  skills: Record<string, unknown>[]
} | null> {
  try {
    const [
      aboutme,
      awards,
      certificates,
      experiences,
      projects,
      activities,
      skills,
    ] = await Promise.all([
      getNotionCache("aboutme"),
      getNotionCache("awards"),
      getNotionCache("certificates"),
      getNotionCache("experiences"),
      getNotionCache("projects"),
      getNotionCache("activities"),
      getNotionCache("skills"),
    ])

    if (
      !aboutme ||
      !awards ||
      !certificates ||
      !experiences ||
      !projects ||
      !activities ||
      !skills
    ) {
      return null
    }

    return {
      aboutme,
      awards,
      certificates,
      experiences,
      projects,
      activities,
      skills,
    }
  } catch (error) {
    console.error("Error getting all notion data:", error)
    return null
  }
}
