import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const FloatingReaction = ({ reaction, onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const positionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(positionAnim, {
        toValue: -200, // Float up by 200 pixels
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete();
    });
  }, [fadeAnim, positionAnim, onAnimationComplete]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: positionAnim }],
        },
      ]}
    >
      <Text style={styles.emoji}>{reaction.type}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 150, // Start just above the controls
    right: 40,
  },
  emoji: {
    fontSize: 40,
  },
});

export default FloatingReaction;
