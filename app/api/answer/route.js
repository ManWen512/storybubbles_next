import { authFetch } from '@/redux/lib/authFetch';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const { questionId, chosenAnswer, userId } = await request.json();

        const res = await authFetch(`${accUrl}/answer`, {
            method: 'POST',
            body: JSON.stringify({ questionId, chosenAnswer, userId }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: err.message || 'Failed to submit answer' },
            { status: err.status || 500 }
        );
    }
}