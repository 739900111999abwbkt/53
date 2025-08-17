// src/core/rooms.ts
// This file defines the core data structure for a Room.

export interface Room {
  id: string;
  name: string;
  isLocked: boolean;
  password?: string; // Optional password
  type: 'audio-only';
  owner: string; // UID of the owner
  participants: string[]; // Array of UIDs of participants
}
