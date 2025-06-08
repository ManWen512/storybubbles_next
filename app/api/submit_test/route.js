import { authFetch } from "@/redux/lib/authFetch";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const { userId, questionsAnswers } = await request.json();
        
        console.log('Received payload:', { userId, questionsAnswers });

        const res = await authFetch(`${accUrl}/answer/test-answers`, {
            method: 'POST',
            body: JSON.stringify({ 
                userId,
                questionsAnswers
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        // First get the response text
        const responseText = await res.text();
        
        // Try to parse it as JSON if possible
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Response parsing error:', parseError);
            // If parsing fails, return the raw text
            return NextResponse.json({ 
                message: responseText,
                status: res.status 
            });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('Test submission error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to submit test answer' },
            { status: err.status || 500 }
        );
    }
}