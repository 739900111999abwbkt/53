import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getLyrics } from '../features/karaoke/karaokeService';

// Define types for the component
interface LyricLine {
  text: string;
  startTime: number;
  endTime: number;
}

interface KaraokeData {
  songId: string;
  title: string;
  artist: string;
  lyrics: LyricLine[];
}

const KaraokeScreen = () => {
  const { theme } = useTheme();
  const [karaokeData, setKaraokeData] = useState<KaraokeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartKaraoke = async () => {
    setIsLoading(true);
    setKaraokeData(null);
    const data = await getLyrics('song_abc_123'); // Use a test song ID
    setKaraokeData(data);
    setIsLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    artist: {
      fontSize: 18,
      color: theme.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    lyricsContainer: {
      flex: 1,
      marginTop: 20,
    },
    lyricLine: {
      fontSize: 20,
      color: theme.text,
      textAlign: 'center',
      paddingVertical: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Button title="Start Karaoke" onPress={handleStartKaraoke} disabled={isLoading} />

      {isLoading && <ActivityIndicator size="large" color={theme.text} />}

      {karaokeData && (
        <View style={styles.lyricsContainer}>
          <Text style={styles.title}>{karaokeData.title}</Text>
          <Text style={styles.artist}>{karaokeData.artist}</Text>
          <FlatList
            data={karaokeData.lyrics}
            keyExtractor={(item, index) => `${item.startTime}-${index}`}
            renderItem={({ item }) => <Text style={styles.lyricLine}>{item.text}</Text>}
          />
        </View>
      )}
    </View>
  );
};

export default KaraokeScreen;
