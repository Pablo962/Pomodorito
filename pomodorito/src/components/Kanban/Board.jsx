import { useState } from 'react';
import { useKanban } from '../../hooks/useKanban';
import TaskCard from './TaskCard';
import styles from './Kanban.module.css';

const COLUMNS = [
  { id: 'todo', title: 'Pendiente', color: '#ff6b6b' },
  { id: 'doing', title: 'En Curso', color: '#feca57' },
  { id: 'done', title: 'Terminado', color: '#4ade80' }
];

export default function Board() {
  const { tasks, addTask, deleteTask, moveTask } = useKanban();
  const [newTaskInput, setNewTaskInput] = useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      moveTask(taskId, status);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    addTask(newTaskInput);
    setNewTaskInput("");
  };

  return (
    <div className={styles.boardContainer}>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          value={newTaskInput}
          onChange={(e) => setNewTaskInput(e.target.value)}
          placeholder="¿Qué tienes que hacer hoy?"
          className={styles.input}
        />
        <button type="submit" className={styles.addBtn}>AGREGAR</button>
      </form>

      <div className={styles.grid}>
        {COLUMNS.map(col => (
          <div 
            key={col.id} 
            className={styles.column}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            style={{ borderTop: `3px solid ${col.color}` }}
          >
            <h3 className={styles.columnTitle} style={{ color: col.color }}>{col.title}</h3>
            
            <div className={styles.cardList}>
              {tasks
                .filter(task => task.status === col.id)
                .map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onDelete={deleteTask} 
                  />
                ))}

                {tasks.filter(t => t.status === col.id).length === 0 && (
                    <div className={styles.emptyPlaceholder}>Arrastra aquí</div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}