import styles from './Kanban.module.css';

export default function TaskCard({ task, onDelete }) {
  
  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div 
      className={styles.card}
      draggable="true" 
      onDragStart={handleDragStart}
    >
      <div className={styles.cardContent}>
        <p>{task.title}</p>
      </div>
      <button 
        onClick={() => onDelete(task.id)} 
        className={styles.deleteBtn}
        title="Eliminar"
      >
        ×
      </button>
    </div>
  );
}