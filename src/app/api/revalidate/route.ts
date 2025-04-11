import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Secret token to prevent unauthorized revalidation
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN || 'default_token';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Validate the token
    const token = request.headers.get('x-revalidate-token');
    if (token !== REVALIDATE_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Get the path to revalidate
    const path = body.path;
    
    if (!path) {
      return NextResponse.json(
        { success: false, message: 'Path is required' },
        { status: 400 }
      );
    }
    
    // Revalidate the path
    revalidatePath(path);
    
    return NextResponse.json({
      success: true,
      message: `Revalidated path: ${path}`,
    });
  } catch (error) {
    console.error('Error revalidating path:', error);
    return NextResponse.json(
      { success: false, message: 'Error revalidating path' },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const token = searchParams.get('token');
    
    // Validate the token
    if (token !== REVALIDATE_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    if (!path) {
      return NextResponse.json(
        { success: false, message: 'Path is required' },
        { status: 400 }
      );
    }
    
    // Revalidate the path
    revalidatePath(path);
    
    return NextResponse.json({
      success: true,
      message: `Revalidated path: ${path}`,
    });
  } catch (error) {
    console.error('Error revalidating path:', error);
    return NextResponse.json(
      { success: false, message: 'Error revalidating path' },
      { status: 500 }
    );
  }
}
