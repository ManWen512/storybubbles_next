// app/api/save-answer/route.js
import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_INTERNAL_INTEGRATION_SECRET,
});


export async function GET(request) {
  try {

    // Query the Notion database
    const response = await notion.databases.query({
      database_id: process.env.NOTION_ANSWERS_DATABASE_ID,
      sorts: [
        {
          property: 'storyName',
          direction: 'ascending'
        }
      ]
    });

    // Format the results
    const answers = response.results.map(page => {
      const properties = page.properties;
      
      return {
        id: page.id,
        username: properties.username?.title?.[0]?.text?.content || '',
        storyName: properties.storyName?.rich_text?.[0]?.text?.content || '',
        question: properties.question?.rich_text?.[0]?.text?.content || '',
        chosenAnswer: properties.chosenAnswer?.rich_text?.[0]?.text?.content || '',
        correctAnswer: properties.correctAnswer?.rich_text?.[0]?.text?.content || '',
        created_time: page.created_time
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: answers,
        count: answers.length,
        message: "Answers retrieved successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error retrieving answers from Notion:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve answers",
        details: error.message,
      },
      { status: 500 }
    );
  }
}