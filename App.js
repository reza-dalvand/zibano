import React from 'react';
import {ThemeProvider} from './src/theme/themeContext';
import ThemeTestScreen from './ThemeTestScreen';

export default function App() {
  return (
    <ThemeProvider>
      <ThemeTestScreen />
    </ThemeProvider>
  );
}
