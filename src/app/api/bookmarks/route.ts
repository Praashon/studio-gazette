import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const articleId = body.articleId as string;
    const sessionId = body.sessionId as string;

    if (!articleId || !sessionId) {
      return NextResponse.json(
        { error: "articleId and sessionId are required" },
        { status: 400 }
      );
    }

    // Use service client for writes (bypasses RLS for server-side operations)
    const serviceClient = createServiceClient();

    const { error } = await (serviceClient
      .from("bookmarks") as any)
      .insert({
        article_id: articleId,
        session_id: sessionId,
      });

    if (error) {
      // If duplicate, that's fine
      if (error.code === "23505") {
        return NextResponse.json({ status: "already_bookmarked" });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "bookmarked" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const articleId = body.articleId as string;
    const sessionId = body.sessionId as string;

    if (!articleId || !sessionId) {
      return NextResponse.json(
        { error: "articleId and sessionId are required" },
        { status: 400 }
      );
    }

    const serviceClient = createServiceClient();

    const { error } = await serviceClient
      .from("bookmarks")
      .delete()
      .eq("article_id", articleId)
      .eq("session_id", sessionId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "removed" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
