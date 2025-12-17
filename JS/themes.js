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
      borderTopbar: '#1a1a1a'
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
      borderTopbar: '#e5e5e5'
    }
  },
  {
    name: 'Untitled',
    id: 'untitled',
    colors: {
      // Primary colors
      primary: '#ff6b6b',
      primaryDark: '#ee5a52',
      secondary: '#4ecdc4',
      accent: '#ffe66d',
      success: '#95e1d3',
      
      // Background colors
      bgDark: '#2d3561',
      bgCard: '#3d4575',
      bgElevated: '#4d5585',
      bgTopbar: '#1a1f3a',
      bgModal: '#1a1f3a',
      bgModalHeader: '#252a4a',
      
      // Text colors
      textPrimary: '#f7fff7',
      textSecondary: '#a8dadc',
      textMuted: '#6c757d',
      textTopbar: '#a8dadc',
      textTitle: '#ffe66d',
      textGameCard: '#f7fff7',
      textModal: '#a8dadc',
      textModalHeader: '#ffe66d',
      
      // Border colors
      borderModal: '#4ecdc4',
      borderTopbar: '#4d5585'
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
