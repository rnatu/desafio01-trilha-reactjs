import { useEffect, useState } from "react";

import "../styles/tasklist.scss";

import { FiTrash, FiCheckSquare } from "react-icons/fi";

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storageTasks = localStorage.getItem('tasks');

    if(storageTasks) {
      return JSON.parse(storageTasks)
    }
    return [];
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");

  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    function getRandomInt() {
      return Math.floor(Math.random() * 100) + 1;
    }

    let randomId = getRandomInt();

    while (tasks.find((task) => task.id === randomId)) {
      randomId = getRandomInt();
    }

    if (!newTaskTitle) return;

    const newTask = {
      id: randomId,
      title: newTaskTitle,
      isComplete: false,
    };

    setTasks((oldstate) => [...oldstate, newTask]);

    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));

    setNewTaskTitle("");
  }

  function handleToggleTaskCompletion(id: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    const newTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            isComplete: !task.isComplete,
          }
        : task
    );

    setTasks(newTasks);

    localStorage.setItem("tasks", JSON.stringify(newTasks));
  }

  function handleRemoveTask(id: number) {
    const filteredTasks = tasks.filter((task) => task.id !== id);

    setTasks(filteredTasks);

    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button
            type="submit"
            data-testid="add-task-button"
            onClick={handleCreateNewTask}
          >
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <div
                className={task.isComplete ? "completed" : ""}
                data-testid="task"
              >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button
                type="button"
                data-testid="remove-task-button"
                onClick={() => handleRemoveTask(task.id)}
              >
                <FiTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}
