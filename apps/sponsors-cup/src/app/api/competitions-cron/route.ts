/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import { NextResponse } from 'next/server';
import { insertCompetitions } from '@/app/lib/data';

export async function GET() {
  await insertCompetitions();
  return NextResponse.json({ success: true });
}