import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  // Use fs here
  const data = fs.readFileSync('path/to/file', 'utf8');
  return NextResponse.json({ data });
}