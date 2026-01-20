import { useState, useEffect } from 'react';

export const useSpotify = () => {
  const [spotifyId, setSpotifyId] = useState(null);
  const [type, setType] = useState('playlist');
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedId = localStorage.getItem('pomodoro_spotify_id');
    const savedType = localStorage.getItem('pomodoro_spotify_type');
    if (savedId) {
      setSpotifyId(savedId);
      setType(savedType || 'playlist');
    }
  }, []);

  const setPlaylistFromUrl = (url) => {
    setError(null);
    
    const regex = /open\.spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);

    if (match && match[2]) {
      const detectedType = match[1];
      const detectedId = match[2];  

      setSpotifyId(detectedId);
      setType(detectedType);
      localStorage.setItem('pomodoro_spotify_id', detectedId);
      localStorage.setItem('pomodoro_spotify_type', detectedType);
      return true;
    } else {
      setError("Link no válido. Asegúrate de copiar el link de Spotify.");
      return false;
    }
  };

  const clearPlaylist = () => {
    setSpotifyId(null);
    localStorage.removeItem('pomodoro_spotify_id');
    localStorage.removeItem('pomodoro_spotify_type');
  };

  return {
    spotifyId,
    type,
    error,
    setPlaylistFromUrl,
    clearPlaylist
  };
};