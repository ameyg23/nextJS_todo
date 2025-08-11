"use client";
import { useState, useEffect } from "react";

// Format date to readable string
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Fetch tasks
  const getTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Create task
  const addTask = async () => {
    if (!title) return;
    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: { "Content-Type": "application/json" },
    });
    setTitle("");
    getTasks();
  };

  // Toggle complete
  const toggleTask = async (id, completed) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !completed }),
      headers: { "Content-Type": "application/json" },
    });
    getTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    getTasks();
  };

  // Start editing
  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  // Update task
  const updateTask = async (id) => {
    if (!editTitle) return;
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title: editTitle }),
      headers: { "Content-Type": "application/json" },
    });
    setEditingId(null);
    setEditTitle("");
    getTasks();
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Task Manager</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Add new task..."
        />
        <button
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-3">
        {tasks.length === 0 ? (
          <li className="text-center text-gray-500 py-4">No tasks yet. Add one above!</li>
        ) : (
          [...tasks]
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((task) => (
              <li
                key={task._id}
                className={`border rounded-lg overflow-hidden transition-all ${
                  task.completed ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="p-4">
                  {editingId === task._id ? (
                    <div className="flex flex-col space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        autoFocus
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => updateTask(task._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <button
                        onClick={() => toggleTask(task._id, task.completed)}
                        className={`mt-1 mr-3 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-blue-500'
                        } transition-colors`}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3
                            className={`text-lg font-medium break-words ${
                              task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                            }`}
                          >
                            {task.title}
                          </h3>
                          <div className="flex space-x-2 ml-2 flex-shrink-0">
                            <button
                              onClick={() => startEdit(task)}
                              className="text-yellow-600 hover:text-yellow-800 p-1 rounded-full hover:bg-yellow-100 transition-colors"
                              title="Edit task"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                              title="Delete task"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500 space-y-1">
                          <div>Created: {formatDate(task.createdAt)}</div>
                          {task.completed ? (
                            <div>Completed: {formatDate(task.completedAt)}</div>
                          ) : task.updatedAt !== task.createdAt ? (
                            <div>Last updated: {formatDate(task.updatedAt)}</div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))
        )}
      </ul>
    </div>
  );
}
