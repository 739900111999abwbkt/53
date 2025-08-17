import database from '@react-native-firebase/database';

/**
 * Sends a reaction to the Realtime Database for a specific room.
 * @param {string} roomId - The ID of the room to send the reaction to.
 * @param {string} reactionType - The emoji or type of the reaction (e.g., '👏').
 */
export const sendReaction = (roomId, reactionType) => {
  if (!roomId || !reactionType) {
    console.error("Room ID and reaction type are required.");
    return;
  }

  const reactionsRef = database().ref(`/rooms/${roomId}/reactions`);
  const newReactionRef = reactionsRef.push();

  newReactionRef
    .set({
      type: reactionType,
      timestamp: database.ServerValue.TIMESTAMP,
    })
    .then(() => console.log(`Reaction '${reactionType}' sent to room ${roomId}`))
    .catch((error) => console.error("Error sending reaction:", error));
};
