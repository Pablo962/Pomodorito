import { useState, useEffect, useRef } from 'react';

export const useTimer = () => {
  const [config, setConfig] = useState({ focus: 25, break: 5 });
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(config.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  const audioStart = useRef(null);
  const audioFinish = useRef(null);

  useEffect(() => {
    const savedCount = localStorage.getItem('pomodoro_count');
    if (savedCount) setPomodorosCompleted(Number(savedCount));

    audioStart.current = new Audio('/sounds/start.mp3');
    audioFinish.current = new Audio('/sounds/finish.mp3');
    audioStart.current.volume = 0.5;
    audioFinish.current.volume = 0.5;
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoro_count', pomodorosCompleted);
  }, [pomodorosCompleted]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    audioFinish.current.play().catch(e => console.warn(e));

    if (mode === 'focus') {
      setPomodorosCompleted(prev => prev + 1);
      setMode('break');
      setTimeLeft(config.break * 60);
    } else {
      setMode('focus');
      setTimeLeft(config.focus * 60);
      setIsActive(false); 
    }
  };

  const updateConfig = (newFocus, newBreak) => {
    const validFocus = Math.min(Math.max(newFocus, 1), 60);
    const validBreak = Math.min(Math.max(newBreak, 1), 60);
    setConfig({ focus: validFocus, break: validBreak });
    if (!isActive) {
      if (mode === 'focus') setTimeLeft(validFocus * 60);
      else setTimeLeft(validBreak * 60);
    }
  };

  const toggleTimer = () => {
    if (!isActive && timeLeft > 0) audioStart.current.play().catch(e => console.warn(e));
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? config.focus * 60 : config.break * 60);
  };

  const skipPhase = () => {
    setIsActive(false);
    if (mode === 'focus') {
      setMode('break');
      setTimeLeft(config.break * 60);
    } else {
      setMode('focus');
      setTimeLeft(config.focus * 60);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? config.focus * 60 : config.break * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return {
    timeLeft, isActive, mode, isFullscreen, config, pomodorosCompleted,
    toggleTimer, resetTimer, updateConfig, toggleFullscreen, formatTime, progress, skipPhase
  };
};
