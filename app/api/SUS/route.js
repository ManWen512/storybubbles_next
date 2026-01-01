// app/api/notion/questions/route.js
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_INTERNAL_INTEGRATION_SECRET,
});

const SUSDB = process.env.NOTION_SUS_DB_ID;

export async function GET() {
  try {
    const testRes = await notion.databases.query({ database_id: SUSDB });

    const tests = testRes.results.map((page) => ({
      id: page.id,
      name: page.properties.Name.title[0]?.plain_text,
      mmtranslate: page.properties.mmTranslate.rich_text[0]?.plain_text || "",
     
    }));

    return NextResponse.json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 });
  }
}