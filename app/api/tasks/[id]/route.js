import connectToDatabase from '@/app/lib/mongodb';
import Task from '@/app/models/Task';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const task = await Task.findById(params.id);
    if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { title, description, completed } = await req.json();
    await connectToDatabase();
    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      { title, description, completed },
      { new: true }
    );

    if (!updatedTask) return NextResponse.json({ message: 'Task not found' }, { status: 404 });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ message: 'Failed to delete task' }, { status: 500 });
  }
}

