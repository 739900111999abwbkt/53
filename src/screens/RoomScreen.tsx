import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Button, PermissionsAndroid, Platform } from 'react-native';
import database from '@react-native-firebase/database';
import { useTheme } from '../theme/ThemeContext';

// Import Agora-based services and components
import agoraManager from '../features/voice-chat/services/connectionManager';
import { toggleMute } from '../features/voice-chat/services/voiceService';
import MicButton from '../features/voice-chat/components/MicButton';
import ParticipantList from '../features/voice-chat/components/ParticipantList';
import FloatingReaction from '../features/voice-chat/components/FloatingReaction';
import TextChat from '../features/text-chat/TextChat';
import { sendReaction } from '../features/voice-chat/services/realtimeService';
import auth from '@react-native-firebase/auth';

const ROOM_ID = 'test-room'; // In a real app, this would be dynamic
const AGORA_TOKEN = null; // In production, a token should be generated from a server

const RoomScreen = () => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const currentUser = auth().currentUser;

  const [isMuted, setIsMuted] = useState(false);
  const [peerIds, setPeerIds] = useState<number[]>([]); // State for remote users
  const [activeReactions, setActiveReactions] = useState<any[]>([]);

  // Main effect for initializing and managing Agora connection
  useEffect(() => {
    const initAgora = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      }

      await agoraManager.init();
      const engine = agoraManager.getEngine();

      engine?.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed);
        setPeerIds(prev => [...prev, uid]);
      });

      engine?.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason);
        setPeerIds(prev => prev.filter(id => id !== uid));
      });

      await agoraManager.joinChannel(ROOM_ID, AGORA_TOKEN, currentUser?.uid || 0);
    };

    initAgora();

    // Cleanup function
    return () => {
      agoraManager.leaveChannel();
      agoraManager.destroy();
    };
  }, [currentUser]);

  // Listener for new reactions (from Firebase)
  useEffect(() => {
    const reactionsRef = database().ref(`/rooms/${ROOM_ID}/reactions`);
    const onNewReaction = reactionsRef.on('child_added', snapshot => {
      if (!snapshot.val() || Date.now() - snapshot.val().timestamp > 10000) return;
      const newReaction = { id: snapshot.key, ...snapshot.val() };
      setActiveReactions(prev => [...prev, newReaction]);
    });
    return () => reactionsRef.off('child_added', onNewReaction);
  }, []);

  const handleMuteToggle = async () => {
    const newMutedState = await toggleMute(!isMuted);
    setIsMuted(newMutedState);
  };

  const handleAnimationComplete = (reactionId: string) => {
    setActiveReactions(prev => prev.filter(r => r.id !== reactionId));
  };

  // Dynamic styles
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.primary },
    roomTitle: { fontSize: 24, fontWeight: 'bold', padding: 10, textAlign: 'center', borderBottomWidth: 1, borderColor: theme.border, color: theme.text },
    participantsContainer: { height: 100 },
    textChatContainer: { flex: 1 },
    controlsContainer: { padding: 10, alignItems: 'center', borderTopWidth: 1, borderColor: theme.border, backgroundColor: theme.secondary },
    mainControls: { marginBottom: 10 },
    reactionsContainer: { flexDirection: 'row', marginTop: 10 },
    reactionButton: { marginHorizontal: 10, padding: 8, backgroundColor: theme.primary, borderRadius: 20 },
    reactionText: { fontSize: 20 },
  });

  const participants = [
      { id: currentUser?.uid || '0', name: 'You' },
      ...peerIds.map(id => ({ id: id.toString(), name: `User ${id}` }))
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.roomTitle}>Voice & Text Chat Room (Agora)</Text>
      <View style={styles.participantsContainer}>
        <ParticipantList participants={participants} />
      </View>
      <View style={styles.textChatContainer}>
        <TextChat roomId={ROOM_ID} />
      </View>
      {activeReactions.map(r => (
        <FloatingReaction key={r.id} reaction={r} onAnimationComplete={() => handleAnimationComplete(r.id)} />
      ))}
      <View style={styles.controlsContainer}>
        <View style={styles.mainControls}>
          <MicButton isMuted={isMuted} onPress={handleMuteToggle} />
        </View>
        <Button title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} onPress={toggleTheme} />
        <View style={styles.reactionsContainer}>
          <TouchableOpacity style={styles.reactionButton} onPress={() => sendReaction(ROOM_ID, '👏')}><Text style={styles.reactionText}>👏</Text></TouchableOpacity>
          <TouchableOpacity style={styles.reactionButton} onPress={() => sendReaction(ROOM_ID, '🔥')}><Text style={styles.reactionText}>🔥</Text></TouchableOpacity>
          <TouchableOpacity style={styles.reactionButton} onPress={() => sendReaction(ROOM_ID, '❤️')}><Text style={styles.reactionText}>❤️</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RoomScreen;
