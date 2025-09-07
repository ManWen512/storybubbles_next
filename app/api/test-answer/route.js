import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_INTERNAL_INTEGRATION_SECRET });
const answersDB = process.env.NOTION_TESTANSWERS_DB_ID; // set this in your .env

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, type, answers } = body; 
    // answers should be { question1: 2, question2: 1, ..., question12: 5 }

    // Create page in Notion database
    const response = await notion.pages.create({
      parent: { database_id: answersDB },
      properties: {
        Name: {
          title: [{ text: { content: username } }],
        },
        type: {
          rich_text: [{ text: { content: type } }],
        },
        ...Object.keys(answers).reduce((acc, key) => {
          acc[key] = { number: answers[key] }; // Store number for each question
          return acc;
        }, {}),
      },
    });

    return NextResponse.json({ success: true, id: response.id });
  } catch (error) {
    console.error("Error saving answers:", error);
    return NextResponse.json({ error: "Failed to save answers" }, { status: 500 });
  }
}
