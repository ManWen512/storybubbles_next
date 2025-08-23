// app/api/notion/route.js
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_INTERNAL_INTEGRATION_SECRET,
});

// Notion DB IDs
const storyDB = process.env.NOTION_STORY_DB_ID;
const sceneDB = process.env.NOTION_SCENE_DB_ID;
const dialogueDB = process.env.NOTION_DIALOGUE_DB_ID;
const questionDB = process.env.NOTION_QUESTION_DB_ID;
const choiceDB = process.env.NOTION_CHOICE_DB_ID;

export async function GET() {
  try {
    // 1. Fetch all tables
    const [storiesRes, scenesRes, dialoguesRes, questionsRes, choicesRes] =
      await Promise.all([
        notion.databases.query({ database_id: storyDB }),
        notion.databases.query({
          database_id: sceneDB,
          sorts: [{ property: "order", direction: "ascending" }],
        }),
        notion.databases.query({
          database_id: dialogueDB,
          sorts: [{ property: "order", direction: "ascending" }],
        }),
        notion.databases.query({ database_id: questionDB }),
        notion.databases.query({
          database_id: choiceDB,
          sorts: [{ property: "order", direction: "ascending" }],
        }),
      ]);

    // 2. Map Notion rows → plain JS objects
    const stories = storiesRes.results.map((page) => ({
      id: page.id,
      name: page.properties.name.title[0]?.plain_text,
      bgMusic: page.properties.bgMusic.files[0]?.file?.url || "",
    }));

    const scenes = scenesRes.results.map((page) => ({
      id: page.id,
      name: page.properties.name.title[0]?.plain_text,
      storyId: page.properties.Stories.relation[0]?.id,
      pictures: page.properties.pictures.files[0]?.file?.url || "",
      order: page.properties.order.number,
    }));

    const dialogues = dialoguesRes.results.map((page) => {
      let timestamps = [];
      try {
        // assume timestamps are stored in Notion as plain text JSON
        const raw = page.properties.timestamps.rich_text[0]?.plain_text || "[]";
        timestamps = JSON.parse(raw);
      } catch (e) {
        console.warn("Invalid JSON in timestamps for dialogue:", page.id);
      }

      return {
        id: page.id,
        sceneId: page.properties.Scenes.relation[0]?.id,
        text: page.properties.text.title[0]?.plain_text,
        sound: page.properties.sound.files[0]?.file?.url || "",
        order: page.properties.order.number,
        timestamps, // parsed JSON
      };
    });

    const questions = questionsRes.results.map((page) => ({
      id: page.id,
      sceneId: page.properties.Scenes.relation[0]?.id,
      questionText: page.properties.questionText.title[0]?.plain_text,
      correctAnswerIndex: page.properties.correctAnswerIndex.number,
    }));

    const choices = choicesRes.results.map((page) => ({
      id: page.id,
      questionId: page.properties.Questions.relation[0]?.id,
      label: page.properties.label.title[0]?.plain_text,
      order: page.properties.order.number,
    }));

    // 3. Join: questions ← choices
    const questionsWithChoices = questions.map((q) => ({
      ...q,
      choices: choices
        .filter((c) => c.questionId === q.id)
        .sort((a, b) => a.order - b.order),
    }));

    // 4. Join: scenes ← dialogues + questions
    const scenesWithData = scenes.map((s) => ({
      ...s,
      dialogues: dialogues
        .filter((d) => d.sceneId === s.id)
        .sort((a, b) => a.order - b.order),
      questions: questionsWithChoices.filter((q) => q.sceneId === s.id),
    }));

    // 5. Join: stories ← scenes
    const result = stories.map((story) => ({
      ...story,
      scenes: scenesWithData.filter((s) => s.storyId === story.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error.body || error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
