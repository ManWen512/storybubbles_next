// app/api/notion/questions/route.js
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_INTERNAL_INTEGRATION_SECRET,
});

const questionDB = process.env.NOTION_QUESTION_DB_ID;

export async function GET() {
  try {
    const questionsRes = await notion.databases.query({ database_id: questionDB });

    const questions = questionsRes.results.map((page) => ({
      id: page.id,
      qid: page.properties.qid.rich_text[0]?.plain_text, // e.g., story1_q1
      questionText: page.properties.questionText.title[0]?.plain_text,
      correctAnswerText: page.properties.correctAnswerIndex.number,
      correctAnswer:page.properties.correctAnswer.rich_text[0]?.plain_text,
    }));

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
