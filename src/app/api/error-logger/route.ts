import { NextRequest, NextResponse } from 'next/server';

// Simple error logging API endpoint
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Extract error information
    const { message, stack, url, userAgent, timestamp } = body;
    
    // Log the error (in a real implementation, you might send this to a logging service)
    console.error('Client-side error:', {
      message,
      stack,
      url,
      userAgent,
      timestamp: timestamp || new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Error logged successfully',
    });
  } catch (error) {
    console.error('Error logging client error:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing error log' },
      { status: 500 }
    );
  }
}
