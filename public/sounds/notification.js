// Archivo para crear un sonido de notificación suave usando la Web Audio API
// Esto nos permite generar un sonido programáticamente sin necesidad de archivos externos

function createNotificationSound() {
  // Crear un contexto de audio
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  
  // Crear un oscilador para el sonido principal
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine'; // Onda sinusoidal (suave)
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // La5 (880Hz)
  oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1); // Bajar a La4 (440Hz)
  
  // Crear un nodo de ganancia para controlar el volumen
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02); // Subir volumen suavemente
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5); // Bajar volumen gradualmente
  
  // Conectar los nodos
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  // Iniciar y detener el oscilador
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.5);
  
  return new Promise(resolve => {
    setTimeout(() => resolve(), 500);
  });
}

// Exportar la función para usarla en el chat
window.playNotificationSound = createNotificationSound;
