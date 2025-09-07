// app/api/save-answer/route.js
import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_INTERNAL_INTEGRATION_SECRET,
});


// Optional: Add filtering by username or story
export async function POST(request) {
  try {
    const { username, story } = await request.json();
    
    let filter = {};
    
    if (username) {
      filter = {
        property: 'username',
        title: {
          contains: username
        }
      };
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_ANSWERS_DATABASE_ID,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      sorts: [
        {
          property: 'username',
          direction: 'ascending'
        }
      ]
    });


    // Same formatting logic as GET
    const answers = response.results.map(page => {
      const properties = page.properties;
      
      const story1Answers = {};
      const story2Answers = {};
      const story3Answers = {};
      
      for (let i = 1; i <= 8; i++) {
        const story1Key = `story1_q${i}`;
        const story2Key = `story2_q${i}`;
        const story3Key = `story3_q${i}`;
        
        story1Answers[`q${i}`] = properties[story1Key]?.rich_text?.[0]?.text?.content || 
                                  properties[story1Key]?.select?.name || 
                                  properties[story1Key]?.title?.[0]?.text?.content || '';
        
        story2Answers[`q${i}`] = properties[story2Key]?.rich_text?.[0]?.text?.content || 
                                  properties[story2Key]?.select?.name || 
                                  properties[story2Key]?.title?.[0]?.text?.content || '';
        
        story3Answers[`q${i}`] = properties[story3Key]?.rich_text?.[0]?.text?.content || 
                                  properties[story3Key]?.select?.name || 
                                  properties[story3Key]?.title?.[0]?.text?.content || '';
      }

     
      return {
        id: page.id,
        username: properties.username?.title?.[0]?.text?.content || '',
        story1: story1Answers,
        story2: story2Answers,
        story3: story3Answers,
        created_time: page.created_time,
        last_edited_time: page.last_edited_time
      };
    });

    // Filter by specific story if requested
    if (story) {
      const filteredAnswers = answers.map(answer => ({
        id: answer.id,
        username: answer.username,
        [story]: answer[story],
        created_time: answer.created_time,
        last_edited_time: answer.last_edited_time
      }));
      
      return NextResponse.json({
        success: true,
        data: filteredAnswers,
        count: filteredAnswers.length,
        message: `${story} answers retrieved successfully`
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: answers,
        count: answers.length,
        message: "Filtered answers retrieved successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error retrieving filtered answers from Notion:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve filtered answers",
        details: error.message,
      },
      { status: 500 }
    );
  }
}