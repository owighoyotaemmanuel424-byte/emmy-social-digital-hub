import { NextRequest, NextResponse } from 'next/server';

const JEJELAYE_BASE_URL = 'https://jejelayegct.com.ng/api/v1';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path ? resolvedParams.path.join('/') : '';
  const searchParams = req.nextUrl.searchParams.toString();
  const targetUrl = `${JEJELAYE_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

  const authHeader = req.headers.get('authorization') || '';

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await req.json();
        body = JSON.stringify(json);
        headers['Content-Type'] = 'application/json';
      } else {
        body = await req.text();
        if (contentType) headers['Content-Type'] = contentType;
      }
    } catch {
      // body empty or parse error
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      // prevent caching for dynamic balance/transactions
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch {
        // fallback to text parse
      }
    }

    const text = await response.text();
    let parsedJson: Record<string, unknown> | null = null;
    try {
      parsedJson = text && text.trim() ? JSON.parse(text) : null;
    } catch {
      parsedJson = null;
    }

    if (parsedJson) {
      return NextResponse.json(parsedJson, { status: response.status });
    }

    return NextResponse.json(
      {
        success: response.ok,
        message: text || `Upstream returned status ${response.status}`,
      },
      {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Network error communicating with JejeLaye API';
    return NextResponse.json(
      {
        success: false,
        error: message,
        hint: 'Check your internet connection or verify the JejeLaye server is online.',
      },
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}
