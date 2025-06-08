import { authFetch } from '@/redux/lib/authFetch';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');
    const userId = searchParams.get('userId');
    const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const res = await authFetch(`${accUrl}/answer/story-answers`);
    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch story' },
      { status: err.status || 500 }
    );
  }
}