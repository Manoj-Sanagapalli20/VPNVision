import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppRoutes } from './routes/AppRoutes';
import { ToastContainer } from './components/common/ToastContainer';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
          <ToastContainer />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
