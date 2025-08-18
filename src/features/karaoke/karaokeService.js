// This service will be responsible for fetching karaoke data.
// For now, it will return mock data.

export const getLyrics = async (songId) => {
  console.log(`Fetching lyrics for song: ${songId}`);

  // Simulate an API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock response based on the API spec we designed
  return {
    songId: songId,
    title: "أغنية كاريوكي تجريبية",
    artist: "فنان افتراضي",
    lyrics: [
      { text: "هذه هي", startTime: 1.5, endTime: 2.5 },
      { text: "بداية الأغنية", startTime: 2.6, endTime: 4.0 },
      { text: "مع بعض الكلمات", startTime: 4.1, endTime: 6.0 },
      { text: "لتجربة الميزة", startTime: 6.1, endTime: 8.5 },
    ]
  };
};
