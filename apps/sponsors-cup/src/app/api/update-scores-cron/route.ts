/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import { NextResponse } from 'next/server';
import { updateScores } from '@/app/lib/data';

export async function GET() {
  await updateScores();
  return NextResponse.json({ success: true });
}