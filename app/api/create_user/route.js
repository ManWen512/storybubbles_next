import { NextResponse } from 'next/server';
import { authFetch } from '@/redux/lib/authFetch';

export async function POST(request) {
    try {
        const { username, profileImage } = await request.json();
        const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const res = await authFetch(`${accUrl}/user/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, profileImage }),
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.status || 500 }
        );
    }
}