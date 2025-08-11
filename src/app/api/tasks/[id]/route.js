import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const { title, completed } = await req.json();
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { title, completed },
    { new: true }
  );
  return new Response(JSON.stringify(updatedTask), { status: 200 });
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  await Task.findByIdAndDelete(id);
  return new Response(JSON.stringify({ message: "Task deleted" }), { status: 200 });
}
