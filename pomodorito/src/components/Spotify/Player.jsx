import{ useState } from 'react';
import { useSpotify } from '../../hooks/useSpotify';
import styles from './Player.module.css';

export default function Player() {
  const { spotifyId, type, error, setPlaylistFromUrl, clearPlaylist } = useSpotify();
  const [inputUrl, setInputUrl] = useState(""); 
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (setPlaylistFromUrl(inputUrl)) {
      setInputUrl(""); 
    }
  };

  if (isMinimized && spotifyId) {
    return (
      <button 
        className={styles.minimizedBtn} 
        onClick={() => setIsMinimized(false)}
        title="Mostrar Spotify"
      >
        🎵
      </button>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>🎧 Spotify</span>
        {spotifyId && (
            <div className={styles.actions}>
                 <button onClick={() => setIsMinimized(true)} className={styles.iconBtn}>_</button>
                 <button onClick={clearPlaylist} className={styles.iconBtn} title="Cambiar playlist">↺</button>
            </div>
        )}
      </div>

      {!spotifyId ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <p className={styles.instruction}>Pega el link de tu playlist, álbum o canción:</p>
          <input 
            type="text" 
            placeholder="https://open.spotify.com/playlist/..." 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loadBtn}>Cargar Música</button>
        </form>
      ) : (
        <div className={styles.playerWrapper}>
          <iframe 
            style={{ borderRadius: '12px' }}
            src={`https://open.spotify.com/embed/${type}/${spotifyId}?utm_source=generator&theme=0`}
            width="100%" 
            height="400" 
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            title="Spotify Player"
          ></iframe>
        </div>
      )}
    </div>
  );
}