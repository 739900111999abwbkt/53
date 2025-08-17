// App.tsx

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/theme/ThemeContext';

/**
 * ‫المكون الرئيسي للتطبيق.
 * ‫يعمل هذا المكون كنقطة الدخول الرئيسية للتطبيق بأكمله.
 */
const App = () => {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
