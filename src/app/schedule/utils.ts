import { LOCAL_STORAGE_KEY } from './constants';
import { CEvent } from './types';

/**
 * Converts a string into an RGB color string using a simple hash function.
 *
 * @param {string} str The input string to hash.
 * @returns {string} An RGB color string in the format "[r, g, b]".
 */
export function stringToRgb(str: string): [number, number, number] {
  let hash = 0;
  // Handle empty or null strings - return black
  if (!str || str.length === 0) {
    return [0, 0, 0]; // Black
  }

  // Simple hashing algorithm (djb2 variation)
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    // Bitwise left shift (<< 5) is multiplication by 32
    // (hash << 5) - hash is equivalent to hash * 31
    hash = (hash << 5) - hash + char;
    // Convert to 32bit integer
    hash |= 0;
  }

  // Extract RGB components from the hash using bitwise operations
  // Ensure values are between 0 and 255
  const r = (hash >> 16) & 0xff; // Extract bits 16-23 for Red
  const g = (hash >> 8) & 0xff; // Extract bits 8-15 for Green
  const b = hash & 0xff; // Extract bits 0-7 for Blue

  // Return the color in CSS rgb() format
  // return `rgb(${r}, ${g}, ${b})`;
  return [r, g, b];
}

/**
 * Determines whether black or white text provides better contrast against a given background color.
 * Uses a simplified formula for perceived brightness (luminance).
 *
 * @param {string} rgbString The background color in "rgb(r, g, b)" format.
 * @returns {string} '#000000' (black) or '#FFFFFF' (white).
 */
export function getContrastColor(rgb: number[]): [number, number, number] {
  // Default to black if parsing fails
  const [r, g, b, a = 1] = rgb;
  // --- Alpha Blending Calculation ---
  // Blend the input color (r, g, b, a) onto the assumed white background (bgR, bgG, bgB)
  // Formula: Result = (Foreground * Alpha) + (Background * (1 - Alpha))
  // Values are first normalized to 0-1, then blended, then scaled back to 0-255.
  // --- Assume a white background ---
  const bgR = 255;
  const bgG = 255;
  const bgB = 255;
  const blendedR = Math.round(((r / 255) * a + (bgR / 255) * (1 - a)) * 255);
  const blendedG = Math.round(((g / 255) * a + (bgG / 255) * (1 - a)) * 255);
  const blendedB = Math.round(((b / 255) * a + (bgB / 255) * (1 - a)) * 255);

  // --- Brightness Calculation (using the blended color) ---
  // Calculate perceived brightness using the W3C formula recommendation (simplified)
  // Formula: (0.299*R + 0.587*G + 0.114*B)
  const brightness = 0.299 * blendedR + 0.587 * blendedG + 0.114 * blendedB;

  // Determine contrast color based on brightness threshold (186 is a commonly used value)
  // If brightness is high (> 186), use black text. Otherwise, use white text.
  return brightness > 186 ? [0, 0, 0] : [255, 255, 255];
}

export const toRgbString = (rgb: number[]): string => {
  const [r, g, b, a = 255] = rgb;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const TimeUtils = {
  toString: (time: number) => {
    time = time % (24 * 60); // Ensure time is within a day
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    return `${paddedHours}:${paddedMinutes}`;
  },
  fromString: (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const result = (hours || 0) * 60 + (minutes || 0);
    return result;
  },
};

export const SerializationUtils = {
  serialize: (events: CEvent[]) => {
    return JSON.stringify(events);
  },
  deserialize: (serializedEvents: string) => {
    try {
      const parsedEvents = JSON.parse(serializedEvents);
      return parsedEvents as CEvent[];
    } catch (error) {
      console.error('Error deserializing events:', error);
      return [];
    }
  },
};

export const saveEventsToLocalStorage = (events: CEvent[]) => {
  window.localStorage.setItem(
    LOCAL_STORAGE_KEY,
    SerializationUtils.serialize(events)
  );
};

export const loadEventsFromLocalStorage = () =>
  SerializationUtils.deserialize(
    window?.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'
  );

export const copySavedCalandar = () => {
  const events = loadEventsFromLocalStorage();
  const serializedEvents = SerializationUtils.serialize(events);
  navigator.clipboard.writeText(serializedEvents);
};

export const pasteSavedCalandar = async () => {
  const clipboardText = await navigator.clipboard.readText();
  try {
    const events = SerializationUtils.deserialize(clipboardText);
    saveEventsToLocalStorage(events);
  } catch (error) {
    console.error('Error pasting events:', error);
  }
};
