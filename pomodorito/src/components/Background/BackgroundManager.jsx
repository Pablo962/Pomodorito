import React, { useState } from 'react';
import { useBackground } from '../../../src/hooks/useBackgroud';
import styles from './BackgroundManager.module.css';

const TOPICS = [
  { id: 'rain', label: 'Lluvia' },
  { id: 'nature', label: 'Naturaleza' },
  { id: 'fireplace', label: 'Chimenea' },
  { id: 'kittens', label: 'Gatitos' },
  { id: 'puppies', label: 'Perritos' }
];

export default function BackgroundManager({ children }) {
  const { currentBg, backgrounds, loading, error, searchBackgrounds, selectBackground, isExternalMuted } = useBackground();
  
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className={styles.container}>
     {currentBg && (
        <video
          key={currentBg.src}
          className={styles.backgroundImage}
          autoPlay
          muted={isExternalMuted} 
          loop
          playsInline
        >
          <source src={currentBg.src} type="video/mp4" />
        </video>
      )}

      <div className={styles.overlay}></div>
      <div className={styles.content}>{children}</div>

      <div className={styles.dock}>
        <button 
          className={styles.dockButton} 
          onClick={() => setShowSelector(!showSelector)}
        >
          {showSelector ? 'Cerrar' : 'Fondo'}
        </button>

        {showSelector && (
          <div className={styles.selectorMenu}>
            {error && <p className={styles.errorMsg}>Error: {error}</p>}

            <div className={styles.topicsGrid}>
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => searchBackgrounds(topic.id)}
                  className={styles.topicBtn}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            <hr className={styles.separator} />
            <div className={styles.resultsGrid}>
              {loading ? (
                <p className={styles.loadingText}>Buscando videos...</p>
              ) : (
                backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => selectBackground(bg)}
                    className={`${styles.thumbBtn} ${currentBg?.src === bg.src ? styles.activeThumb : ''}`}
                    style={{ backgroundImage: `url(${bg.image})` }}
                    title="Click para seleccionar"
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}