import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const updateData = await req.json();
    
    // If updating completed status, set completedAt accordingly
    if (updateData.completed !== undefined) {
      updateData.completedAt = updateData.completed ? new Date() : null;
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedTask) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });
    }
    
    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  await Task.findByIdAndDelete(id);
  return new Response(JSON.stringify({ message: "Task deleted" }), { status: 200 });
}
