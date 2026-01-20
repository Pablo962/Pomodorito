import { useState, useEffect } from 'react';

const INITIAL_TASKS = [
  { id: '1', title: 'Configurar Pomodoro', status: 'done' },
  { id: '2', title: 'Integrar Spotify', status: 'done' },
  { id: '3', title: 'Diseñar Tablero Kanban', status: 'doing' },
  { id: '4', title: 'Probar Drag & Drop', status: 'todo' },
];

export const useKanban = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('pomodoro_tasks');
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Error al leer tareas", e);
        setTasks(INITIAL_TASKS);
      }
    } else {
      setTasks(INITIAL_TASKS);
    }
    setIsLoaded(true);
  }, []);


  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pomodoro_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  
  const addTask = (title) => {
    const newTask = {
      id: Date.now().toString(), 
      title,
      status: 'todo'
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const moveTask = (id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  return {
    tasks,
    addTask,
    deleteTask,
    moveTask
  };
};