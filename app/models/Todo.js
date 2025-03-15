import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

export default Todo;