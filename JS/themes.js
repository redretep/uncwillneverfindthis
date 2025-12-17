/**
 * Theme Configuration
 * 
 * HOW TO ADD A NEW THEME:
 * ----------------------
 * 1. Copy one of the existing theme objects below
 * 2. Change the 'name' field to your theme's display name
 * 3. Change the 'id' field to a unique lowercase identifier (e.g., 'ocean', 'forest')
 * 4. Modify the color values in the 'colors' object:
 *    - Use hex color codes (e.g., '#ff6b6b')
 *    - All fields are required for the theme to work properly
 * 5. Add your new theme object to the themes array
 * 6. The theme will automatically appear in the dropdown!
 * 
 * COLOR FIELDS EXPLAINED:
 * ----------------------
 * primary: Main accent color (used for highlights, active states)
 * primaryDark: Darker version of primary color
 * secondary: Secondary accent color
 * accent: Additional accent color
 * success: Success/positive color
 * 
 * bgDark: Main background color
 * bgCard: Card/container background color
 * bgElevated: Elevated element background color (hover states, modals)
 * bgTopbar: Top navigation bar background
 * bgModal: Modal/dialog background
 * bgModalHeader: Modal header background
 * 
 * textPrimary: Primary text color
 * textSecondary: Secondary text color (less emphasis)
 * textMuted: Muted text color (least emphasis)
 * textTopbar: Top navigation bar text color
 * textTitle: Main title text color
 * textGameCard: Game card title text color
 * textModal: Modal content text color
 * textModalHeader: Modal header text color
 * 
 * borderModal: Modal border color
 * borderTopbar: Top navigation bar border color
 * 
 * bgSearchBar: Search bar background color
 * bgSearchBarFocus: Search bar background when focused
 * borderSearchBar: Search bar border color
 */

const themes = [
  {
    name: 'Dark',
    id: 'dark',
    colors: {
      // Primary colors
      primary: '#ffffff',
      primaryDark: '#e5e5e5',
      secondary: '#cccccc',
      accent: '#f5f5f5',
      success: '#ffffff',
      
      // Background colors
      bgDark: '#000000',
      bgCard: '#0a0a0a',
      bgElevated: '#1a1a1a',
      bgTopbar: '#000000',
      bgModal: '#000000',
      bgModalHeader: '#0a0a0a',
      
      // Text colors
      textPrimary: '#ffffff',
      textSecondary: '#999999',
      textMuted: '#666666',
      textTopbar: '#999999',
      textTitle: '#ffffff',
      textGameCard: '#ffffff',
      textModal: '#999999',
      textModalHeader: '#ffffff',
      
      // Border colors
      borderModal: '#333333',
      borderTopbar: '#1a1a1a',
      
      // Search bar colors
      bgSearchBar: '#0a0a0a',
      bgSearchBarFocus: '#0a0a0a',
      borderSearchBar: '#1a1a1a',
      
      // Status colors
      colorInGame: '#7bd7a6',
      colorOnline: '#2ecc71'
    }
  },
  {
    name: 'Light',
    id: 'light',
    colors: {
      // Primary colors
      primary: '#000000',
      primaryDark: '#1a1a1a',
      secondary: '#333333',
      accent: '#0a0a0a',
      success: '#000000',
      
      // Background colors
      bgDark: '#ffffff',
      bgCard: '#f5f5f5',
      bgElevated: '#e5e5e5',
      bgTopbar: '#ffffff',
      bgModal: '#ffffff',
      bgModalHeader: '#f5f5f5',
      
      // Text colors
      textPrimary: '#000000',
      textSecondary: '#666666',
      textMuted: '#999999',
      textTopbar: '#666666',
      textTitle: '#000000',
      textGameCard: '#000000',
      textModal: '#666666',
      textModalHeader: '#000000',
      
      // Border colors
      borderModal: '#cccccc',
      borderTopbar: '#e5e5e5',
      
      // Search bar colors
      bgSearchBar: '#f5f5f5',
      bgSearchBarFocus: '#ffffff',
      borderSearchBar: '#e5e5e5',
      
      // Status colors
      colorInGame: '#15803d',
      colorOnline: '#16a34a'
    }
  },
  {
    name: 'Pride',
    id: 'pride',
    colors: {
      // Primary colors
      primary: '#E40303',       // Red (Life)
      primaryDark: '#FF8C00',   // Orange (Healing)
      secondary: '#FFED00',     // Yellow (Sunlight)
      accent: '#008026',        // Green (Nature)
      success: '#2497D4',
      
      // Background colors
      bgDark: '#1A0B2E',        // Deep Midnight
      bgCard: '#2D1B4D',        // Dark Violet
      bgElevated: '#3E2A61',    // Medium Violet
      bgTopbar: '#120721',      // Near Black
      bgModal: '#1A0B2E',
      bgModalHeader: '#2D1B4D',
      
      // Text colors
      textPrimary: '#FFFFFF',
      textSecondary: '#E0B1FF', // Soft Lavender
      textMuted: '#9D89B3',
      textTopbar: '#FFFFFF',
      textTitle: '#FFED00',     // Yellow Title for pop
      textGameCard: '#FFFFFF',
      textModal: '#E0B1FF',
      textModalHeader: '#FFED00',
      
      // Border colors
      borderModal: '#732982',   // Purple (Spirit)
      borderTopbar: '#3E2A61',
      
      // Search bar colors
      bgSearchBar: '#2D1B4D',
      bgSearchBarFocus: '#3E2A61',
      borderSearchBar: '#2497D4',
      
      // Status colors
      colorInGame: '#7bd7a6',
      colorOnline: '#2ecc71'
    }
  }
];

// Get theme by ID
function getThemeById(id) {
  const theme = themes.find(theme => theme.id === id);
  if (!theme) {
    console.warn(`Theme with id "${id}" not found. Falling back to default theme.`);
    return themes[0];
  }
  return theme;
}

// Get all theme names for dropdown
function getAllThemes() {
  return themes;
}
