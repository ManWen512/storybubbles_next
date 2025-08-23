import { Client } from '@notionhq/client';
import { v4 as uuidv4 } from 'uuid';

const notion = new Client({
  auth: process.env.NOTION_INTERNAL_INTEGRATION_SECRET,
});

export async function POST(request) {
  try {
    const { username, profileImage } = await request.json();

    if (!username || !profileImage) {
      return Response.json(
        { error: 'Missing required fields: username, profileImage' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID,
      filter: {
        property: "username",
        rich_text: {
          equals: username
        }
      }
    });

    if (existingUser.results.length > 0) {
      return Response.json(
        { error: 'Username already exists. Please choose a different username.' },
        { status: 409 }
      );
    }

    // Generate unique user ID
    const userId = `user_${uuidv4().replace(/-/g, '').substring(0, 12)}`;

    // Create new user in Notion database
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_USERS_DATABASE_ID,
      },
      properties: {
        id: {
          title: [
            {
              text: {
                content: userId
              }
            }
          ]
        },
        username: {
          rich_text: [
            {
              text: {
                content: username
              }
            }
          ]
        },
        profileImage: {
          url: profileImage
        },
        createdAt: {
          date: {
            start: new Date().toISOString()
          }
        },
        lastActive: {
          date: {
            start: new Date().toISOString()
          }
        }
      }
    });

    return Response.json({
      success: true,
      id: userId,
      username,
      profileImage,
      notionId: response.id,
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user in Notion:', error);
    return Response.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}