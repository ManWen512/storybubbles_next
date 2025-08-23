import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_INTERNAL_INTEGRATION_SECRET,
});


export async function POST(request) {
  try {
    const { username, storyName, question, chosenAnswer, correctAnswer } =
      await request.json();

    // Validate required fields
    if (!username || !question || chosenAnswer === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new row in Notion database
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_ANSWERS_DATABASE_ID,
      },
      properties: {
        // username is expected to be title
        username: {
          title: [
            {
              text: {
                content: username,
              },
            },
          ],
        },
        // storyName is expected to be rich_text
        storyName: {
          rich_text: [
            {
              text: {
                content: storyName || "",
              },
            },
          ],
        },
        question: {
          rich_text: [
            {
              text: {
                content: question,
              },
            },
          ],
        },
        // chosenAnswer is expected to be checkbox
        chosenAnswer: {
          rich_text: [
            {
              text: {
                content: chosenAnswer,
              },
            },
          ],
        },
         correctAnswer: {
          rich_text: [
            {
              text: {
                content: correctAnswer,
              },
            },
          ],
        },
        // Removed isCorrect and timestamp as they don't exist in the database
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: response.id,
        message: "Answer saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving answer to Notion:", error);
    return NextResponse.json(
      {
        error: "Failed to save answer",
        details: error.message,
      },
      { status: 500 }
    );
  }
}