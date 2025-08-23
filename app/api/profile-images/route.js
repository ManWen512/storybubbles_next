import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_INTERNAL_INTEGRATION_SECRET,
});

export async function GET(request) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_PROFILE_IMAGES_DATABASE_ID,
      sorts: [{ property: "order", direction: "ascending" }],
    });

    const images = response.results
      .map((page) => {
        const properties = page.properties;
        return {
          id: properties.id?.title?.[0]?.text?.content || page.id,
          name: properties.name?.rich_text?.[0]?.text?.content || "",
          imageUrl: properties.imageUrl?.url || "",
          order: properties.order?.number || 0,
        };
      })
      .filter((img) => img.imageUrl);

    const imageUrls = images.map((img) => img.imageUrl);

    return Response.json({
      success: true,
      images: imageUrls,
      imageData: images,
    });
  } catch (error) {
    console.error("Error fetching profile images from Notion:", error);
    return Response.json(
      {
        error: "Failed to fetch profile images",
        details: error.message,
      },
      { status: 500 }
    );
  }
}