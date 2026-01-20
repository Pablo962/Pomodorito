import { useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import styles from './Timer.module.css';

export default function Timer() {
  const {
    isActive, mode, isFullscreen, config,
    toggleTimer, resetTimer, updateConfig, toggleFullscreen, formatTime, progress, skipPhase
  } = useTimer();

  const [showSettings, setShowSettings] = useState(false);
  const handleFocusChange = (e) => updateConfig(Number(e.target.value), config.break);
  const handleBreakChange = (e) => updateConfig(config.focus, Number(e.target.value));

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <span className={styles.statusBadge}>
          {mode === 'focus' ? '🔥 MODO ENFOQUE' : '☕ MODO DESCANSO'}
        </span>
        
        <div className={styles.headerControls}>
      
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={styles.iconBtn}
            title="Configurar tiempos"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>

          <button 
            onClick={toggleFullscreen} 
            className={styles.iconBtn}
            title={isFullscreen ? "Salir" : "Pantalla completa"}
          >
            {isFullscreen ? (
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
               </svg>
            ) : (
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
               </svg>
            )}
          </button>
        </div>
      </div>

      {!showSettings ? (
        <>
          <div className={styles.timerDisplay}>{formatTime()}</div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%`, background: mode === 'focus' ? '#4ade80' : '#60a5fa' }} />
          </div>
          <div className={styles.controls}>
            <button onClick={toggleTimer} className={`${styles.mainButton} ${isActive ? styles.pauseBtn : styles.startBtn}`}>
              {isActive ? 'PAUSAR' : (mode === 'focus' ? 'ENFOCAR' : 'DESCANSAR')}
            </button>
            <button onClick={resetTimer} className={styles.secondaryBtn} title="Reiniciar">↺</button>
             <button onClick={skipPhase} className={styles.secondaryBtn} title="Saltar">⏭</button>
          </div>
        </>
      ) : (
        <div className={styles.settingsPanel}>
          <h3 className={styles.settingsTitle}>Personalizar Tiempos</h3>
          <div className={styles.settingRow}>
            <label>Enfoque: <span className={styles.val}>{config.focus} min</span></label>
            <input type="range" min="1" max="60" value={config.focus} onChange={handleFocusChange} className={styles.slider} />
          </div>
          <div className={styles.settingRow}>
            <label>Descanso: <span className={styles.val}>{config.break} min</span></label>
            <input type="range" min="1" max="60" value={config.break} onChange={handleBreakChange} className={styles.slider} />
          </div>
          <button onClick={() => setShowSettings(false)} className={styles.saveBtn}>Volver</button>
        </div>
      )}
    </div>
  );
}