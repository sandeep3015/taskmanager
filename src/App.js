import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "Pending",
    priority: "Medium",
  });

  const [editTask, setEditTask] = useState({ id: null, data: {} });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.name || !newTask.description || !newTask.dueDate) return;

    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
      setNewTask({ name: "", description: "", dueDate: "", status: "Pending", priority: "Medium" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, { method: "DELETE" });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async () => {
    if (!editTask.data.name || !editTask.data.description || !editTask.data.dueDate) return;

    try {
      const response = await fetch(`http://localhost:5000/tasks/${editTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editTask.data),
      });

      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
      setEditTask({ id: null, data: {} });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div>
        <h2>Create Task</h2>
        <label htmlFor="taskName">Name</label>
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          id="taskName"
        />
        <label htmlFor="taskDescription">Description</label>
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          id="taskDescription"
        />
        <br/>
        <label htmlFor="taskDescription">Date</label>
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          id="dueDate"
        />
        <br/>
        <label htmlFor="taskStatus">Satus</label>
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          id="taskStatus"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <br/>
        <label htmlFor="taskPriority">Priority</label>
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          id="taskPriority"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <div>
        <h2>Task List</h2>
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                {editTask.id === task._id ? (
                  <div>
                    <input
                      type="text"
                      value={editTask.data.name}
                      onChange={(e) =>
                        setEditTask({ ...editTask, data: { ...editTask.data, name: e.target.value } })
                      }
                    />
                    <textarea
                      value={editTask.data.description}
                      onChange={(e) =>
                        setEditTask({ ...editTask, data: { ...editTask.data, description: e.target.value } })
                      }
                    />
                    <input
                      type="date"
                      value={editTask.data.dueDate}
                      onChange={(e) =>
                        setEditTask({ ...editTask, data: { ...editTask.data, dueDate: e.target.value } })
                      }
                    />
                    <select
                      value={editTask.data.status}
                      onChange={(e) =>
                        setEditTask({ ...editTask, data: { ...editTask.data, status: e.target.value } })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <select
                      value={editTask.data.priority}
                      onChange={(e) =>
                        setEditTask({ ...editTask, data: { ...editTask.data, priority: e.target.value } })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <button onClick={updateTask}>Save Changes</button>
                  </div>
                ) : (
                  <div>
                    <h3>{task.name}</h3>
                    <p>{task.description}</p>
                    <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                    <p>Status: {task.status}</p>
                    <p>Priority: {task.priority}</p>
                    <button onClick={() => setEditTask({ id: task._id, data: task })}>Edit</button>
                    <button onClick={() => deleteTask(task._id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
