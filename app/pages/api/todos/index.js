import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';

// POST a new todo
export async function POST(request) {
  await dbConnect();
  try {
    const { title, description, date } = await request.json();
    const newTodo = new Todo({ title, description, date });
    await newTodo.save();
    console.log('✅ Todo created:', newTodo); // Log the created todo
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating todo:', error); // Log the error
    return NextResponse.json({ message: 'Error creating todo', error }, { status: 500 });
  }
}