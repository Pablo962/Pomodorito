import { useState, useEffect } from 'react';

export const useBackground = () => {
  const [currentBg, setCurrentBg] = useState(null);
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExternalMuted, setIsExternalMuted] = useState(false);

  useEffect(() => {
    const savedBgUrl = localStorage.getItem('pomodoro_bg_url');
    if (savedBgUrl) {
      setCurrentBg({ src: savedBgUrl, type: 'video' });
    } else {
      searchBackgrounds('lofi study');
    }
  }, []);

  useEffect(() => {
    const handleMute = () => setIsExternalMuted(true);
    const handleUnmute = () => setIsExternalMuted(false);

    window.addEventListener('spotify-opened', handleMute);
    window.addEventListener('spotify-closed', handleUnmute);

    return () => {
      window.removeEventListener('spotify-opened', handleMute);
      window.removeEventListener('spotify-closed', handleUnmute);
    };
  }, []);

  const searchBackgrounds = async (query) => {
    setLoading(true);
    setError(null);
    const apiKey = import.meta.env.PUBLIC_PEXELS_KEY;

    try {
      if (!apiKey) throw new Error("Falta la API Key de Pexels en el archivo .env");

      const response = await fetch(`https://api.pexels.com/videos/search?query=${query}&per_page=6&orientation=landscape`, {
        headers: { Authorization: apiKey }
      });

      if (!response.ok) throw new Error("Error conectando con Pexels");

      const data = await response.json();

      const videos = data.videos.map(vid => ({
        id: vid.id,
        src: vid.video_files.find(f => f.width >= 1280 && f.width <= 1920)?.link || vid.video_files[0].link,
        image: vid.image 
      }));

      setBackgrounds(videos);
      
      if (!currentBg && videos.length > 0) {
        selectBackground(videos[0]);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectBackground = (bg) => {
    setCurrentBg(bg);
    localStorage.setItem('pomodoro_bg_url', bg.src);
  };

  return {
    currentBg,
    backgrounds,
    loading,
    error,
    searchBackgrounds,
    selectBackground,
    isExternalMuted
  };
};