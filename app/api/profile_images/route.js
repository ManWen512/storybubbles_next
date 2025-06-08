import { NextResponse } from 'next/server';
import { authFetch } from '@/redux/lib/authFetch';

export async function GET() {
    try {
        const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await authFetch(`${accUrl}/user/profile-images`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.status || 500 }
        );
    }
}