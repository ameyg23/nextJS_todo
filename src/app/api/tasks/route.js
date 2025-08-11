import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET() {
  await connectDB();
  const tasks = await Task.find();
  return new Response(JSON.stringify(tasks), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const { title } = await req.json();
  const newTask = await Task.create({ title });
  return new Response(JSON.stringify(newTask), { status: 201 });
}
