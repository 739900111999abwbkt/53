import agoraManager from './connectionManager';

/**
 * Toggles the local user's microphone mute state.
 * @param {boolean} isMuted - The desired mute state.
 */
export const toggleMute = async (isMuted) => {
  const engine = agoraManager.getEngine();
  if (engine) {
    try {
      await engine.muteLocalAudioStream(isMuted);
      console.log(`Local audio stream muted: ${isMuted}`);
      return isMuted;
    } catch (e) {
      console.error('Failed to toggle mute:', e);
      return !isMuted; // Return the opposite state on failure
    }
  }
  return !isMuted;
};
