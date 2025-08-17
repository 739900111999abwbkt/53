import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function TextChat({ roomId }) {
  const [messages, setMessages] = useState([]);
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (!roomId || !currentUser) return;

    const unsubscribe = firestore()
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          setMessages([]);
          return;
        }
        const msgs = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          };
        });
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [roomId, currentUser]);

  const onSend = async (msgs = []) => {
    if (!roomId || !currentUser) return;

    const message = msgs[0];
    await firestore()
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .add({
        ...message,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  };

  if (!currentUser) {
    // Or render a loading indicator, or a message to login
    return null;
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={msgs => onSend(msgs)}
      user={{ _id: currentUser.uid }}
    />
  );
}
