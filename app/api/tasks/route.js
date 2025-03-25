import connectToDatabase from '@/app/lib/mongodb';
import Task from '@/app/models/Task';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const tasks = await Task.find();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, description } = await req.json();
    await connectToDatabase();
    const newTask = await Task.create({ title, description });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create task' }, { status: 500 });
  }
}