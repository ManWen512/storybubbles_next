import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_INTERNAL_INTEGRATION_SECRET,
});

export async function POST(request) {
  try {
    const { username, storyName, questionNumber, answer } = await request.json();

    // Validate required fields
    if (!username || !storyName || !questionNumber || answer === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: username, storyName, questionNumber, answer" },
        { status: 400 }
      );
    }

    // Map story names to column prefixes
    const storyPrefixMap = {
      "The Forest": "story1",
      "The Kingdom of Lost Words": "story2", 
      "The Ocean of Stolen Stories": "story3"
    };

    const storyPrefix = storyPrefixMap[storyName];
    if (!storyPrefix) {
      return NextResponse.json(
        { error: "Invalid story name" },
        { status: 400 }
      );
    }

    // Validate question number
    if (questionNumber < 1 || questionNumber > 8) {
      return NextResponse.json(
        { error: "Question number must be between 1 and 8" },
        { status: 400 }
      );
    }

    const columnName = `${storyPrefix}_q${questionNumber}`;

    // First, check if user already exists
    const existingUserQuery = await notion.databases.query({
      database_id: process.env.NOTION_ANSWERS_DATABASE_ID,
      filter: {
        property: "username",
        title: {
          equals: username
        }
      }
    });

    let response;

    if (existingUserQuery.results.length > 0) {
      // User exists, update the specific column
      const existingPage = existingUserQuery.results[0];
      
      response = await notion.pages.update({
        page_id: existingPage.id,
        properties: {
          [columnName]: {
            rich_text: [
              {
                text: {
                  content: String(answer),
                },
              },
            ],
          },
          timestamp: {
            date: {
              start: new Date().toISOString(),
            },
          },
        },
      });
    } else {
      // Create new user row with only the specific column filled
      const properties = {
        username: {
          title: [
            {
              text: {
                content: username,
              },
            },
          ],
        },
        [columnName]: {
          rich_text: [
            {
              text: {
                content: String(answer),
              },
            },
          ],
        },
        timestamp: {
          date: {
            start: new Date().toISOString(),
          },
        },
      };

      // Initialize all other columns as empty (optional - Notion will do this automatically)
      const allStoryPrefixes = ["story1", "story2", "story3"];
      allStoryPrefixes.forEach(prefix => {
        for (let i = 1; i <= 8; i++) {
          const colName = `${prefix}_q${i}`;
          if (colName !== columnName) {
            properties[colName] = {
              rich_text: []
            };
          }
        }
      });

      response = await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_ANSWERS_DATABASE_ID,
        },
        properties: properties,
      });
    }

    return NextResponse.json(
      {
        success: true,
        id: response.id,
        message: `Answer saved successfully for ${storyName}, Question ${questionNumber}`,
        data: {
          username,
          storyName,
          questionNumber,
          answer,
          columnName
        }
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

