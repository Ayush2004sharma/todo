import connectToDatabase from '@/lib/mongodb';
import Todo from '@/models/Todo';

export default async function handler(req, res) {
  await connectToDatabase();

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { title, description, date } = req.body;

    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { title, description, date },
        { new: true }
      );
      res.status(200).json(updatedTodo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update todo' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Todo.findByIdAndDelete(id);
      res.status(204).json({});
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
