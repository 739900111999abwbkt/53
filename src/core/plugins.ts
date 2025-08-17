// src/core/plugins.ts
// This file defines the basic structure for a plugin system.

// Define the interface for a generic plugin
export interface Plugin {
  name: string;
  init: () => void; // Initialization function
  cleanup?: () => void; // Optional cleanup function
};

// A simple in-memory array to hold the loaded plugins
const loadedPlugins: Plugin[] = [];

/**
 * A simple function to load a plugin.
 * In a real-world advanced system, this could involve dynamic imports.
 * @param {Plugin} plugin - The plugin to load.
 */
export const loadPlugin = (plugin: Plugin) => {
  console.log(`Loading plugin: ${plugin.name}`);
  loadedPlugins.push(plugin);
  plugin.init();
};

/**
 * Gets the list of currently loaded plugins.
 * @returns {Plugin[]}
 */
export const getLoadedPlugins = (): Plugin[] => {
  return loadedPlugins;
};
