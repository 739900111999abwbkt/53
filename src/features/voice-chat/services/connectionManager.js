import RtcEngine from 'react-native-agora';

// --- IMPORTANT ---
// This App ID is a placeholder. The user must provide their own
// App ID from their Agora project console.
const APP_ID = 'YOUR_AGORA_APP_ID';

class AgoraManager {
  _engine;

  constructor() {
    this._engine = null;
  }

  /**
   * Initializes the Agora RTC Engine.
   */
  async init() {
    if (this._engine) {
      return;
    }
    try {
      this._engine = await RtcEngine.create(APP_ID);
      await this._engine.enableAudio(); // Enable the audio module.

      // Set the channel profile to Live Broadcasting, common for voice chat rooms.
      await this._engine.setChannelProfile(1); // 1 for Live Broadcasting
      // Set the client role to Broadcaster.
      await this._engine.setClientRole(1); // 1 for Broadcaster

      console.log('Agora Engine initialized successfully.');
    } catch (e) {
      console.error('Failed to initialize Agora Engine:', e);
    }
  }

  /**
   * Joins a specific channel.
   * @param {string} channelName - The name of the channel to join.
   * @param {string} token - The token for joining the channel. (Can be null for testing).
   * @param {number} uid - The user ID.
   */
  async joinChannel(channelName, token, uid) {
    if (!this._engine) {
      await this.init();
    }
    await this._engine?.joinChannel(token, channelName, null, uid);
    console.log(`Joined channel: ${channelName}`);
  }

  /**
   * Leaves the current channel.
   */
  async leaveChannel() {
    await this._engine?.leaveChannel();
    console.log('Left the channel.');
  }

  /**
   * Destroys the engine instance.
   */
  destroy() {
    this._engine?.destroy();
    this._engine = null;
    console.log('Agora Engine destroyed.');
  }

  getEngine() {
    return this._engine;
  }
}

// Export a singleton instance of the manager
const agoraManager = new AgoraManager();
export default agoraManager;
