import React, { useEffect, useState } from 'react';
import './styles.css';

interface Task {
  id: number;
  title: string;
  description?: string;
  is_complete: boolean;
}

interface TasksProps {
  token: string;
}

const Tasks: React.FC<TasksProps> = ({ token }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5001/tasks', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      } else {
        alert(data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching tasks.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const addTask = async () => {
    try {
      const response = await fetch('http://localhost:5001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks([...tasks, data]);
        setNewTitle('');
        setNewDescription('');
      } else {
        alert(data.message || 'Failed to add task');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding a task.');
    }
  };

  const toggleTaskComplete = async (task: Task) => {
    try {
      const response = await fetch(`http://localhost:5001/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...task, is_complete: !task.is_complete }),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.map(t => (t.id === task.id ? data : t)));
      } else {
        alert(data.message || 'Failed to update task');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating task.');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5001/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      } else {
        alert(data.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting task.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '720px' }}>
      <div className="card">
        <h2>Your Tasks</h2>
        <div className="form-group" style={{ flexDirection: 'row', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            className="input"
            style={{ flex: 2 }}
            type="text"
            placeholder="Task Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            className="input"
            style={{ flex: 3 }}
            type="text"
            placeholder="Task Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button className="button" onClick={addTask}>
            Add Task
          </button>
        </div>
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <div>
              <span className={`task-title ${task.is_complete ? 'task-complete' : ''}`}>{task.title}</span>
              {task.description && (
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                  {task.description}
                </div>
              )}
            </div>
            <div className="task-buttons">
              <button onClick={() => toggleTaskComplete(task)}>
                {task.is_complete ? 'Undo' : 'Complete'}
              </button>
              <button className="delete" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
