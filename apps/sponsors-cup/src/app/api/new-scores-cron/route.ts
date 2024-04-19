/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import { NextResponse } from 'next/server';
import { insertNewScores } from '@/app/lib/data';

export async function GET() {
  await insertNewScores();
  return NextResponse.json({ success: true });
}