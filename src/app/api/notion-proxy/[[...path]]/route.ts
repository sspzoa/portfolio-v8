import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  path?: string[]
}

const NOTION_BASE_URL = (
  process.env.NOTION_BASE_URL || "https://api.notion.com"
).replace(/\/$/, "")
const NOTION_VERSION = process.env.NOTION_VERSION || "2022-02-22"
const DEFAULT_DATABASE_ID = process.env.NOTION_DATABASE_ID

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  return proxyRequest(request, await params)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  return proxyRequest(request, await params)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  return proxyRequest(request, await params)
}

async function proxyRequest(request: NextRequest, params: RouteParams) {
  const pathSegments = params.path || []
  const token = resolveToken(request)
  if (!token) {
    return NextResponse.json(
      { message: "Notion API key is missing" },
      { status: 400 }
    )
  }

  const targetPath = resolveTargetPath(pathSegments, request.method)
  if (!targetPath) {
    return NextResponse.json(
      { message: "Unsupported Notion endpoint" },
      { status: 404 }
    )
  }

  try {
    const upstreamResponse = await fetch(`${NOTION_BASE_URL}${targetPath}`, {
      method: request.method,
      headers: buildHeaders(token, request.headers.get("content-type")),
      body: await buildBody(request),
      cache: "no-store",
    })

    const bodyText = await upstreamResponse.text()
    const responseHeaders = new Headers({
      "content-type":
        upstreamResponse.headers.get("content-type") || "application/json",
    })

    return new NextResponse(bodyText, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("[NotionProxy] Upstream request failed", error)
    return NextResponse.json(
      { message: "Failed to reach Notion API" },
      { status: 502 }
    )
  }
}

function resolveToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader) {
    const [, token] = authHeader.split(" ")
    if (token?.trim()) {
      return token.trim()
    }
  }
  const customHeader = request.headers.get("x-notion-token")
  if (customHeader?.trim()) {
    return customHeader.trim()
  }
  if (process.env.NOTION_API_KEY?.trim()) {
    return process.env.NOTION_API_KEY.trim()
  }
  return null
}

function resolveTargetPath(
  pathSegments: string[],
  method: string
): string | null {
  if (pathSegments.length === 0) {
    return null
  }

  const [resource, resourceId, action] = pathSegments

  if (resource === "databases") {
    const dbId = resourceId || DEFAULT_DATABASE_ID
    if (!dbId) {
      return null
    }

    if (method === "GET" && pathSegments.length === 2) {
      return `/v1/databases/${dbId}`
    }

    if (method === "POST" && action === "query") {
      return `/v1/databases/${dbId}/query`
    }
  }

  if (resource === "pages" && resourceId) {
    if (method === "GET" && pathSegments.length === 2) {
      return `/v1/pages/${resourceId}`
    }
    if (method === "PATCH" && pathSegments.length === 2) {
      return `/v1/pages/${resourceId}`
    }
  }

  return null
}

function buildHeaders(token: string, contentType: string | null) {
  const headers = new Headers()
  headers.set("Authorization", `Bearer ${token}`)
  headers.set("Notion-Version", NOTION_VERSION)
  headers.set("Accept", "application/json")
  headers.set("Content-Type", contentType || "application/json")
  return headers
}

async function buildBody(request: NextRequest) {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined
  }
  const text = await request.text()
  return text.length > 0 ? text : undefined
}
