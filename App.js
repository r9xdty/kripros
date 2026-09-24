import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DataProvider, useData } from './src/state/DataContext';
import { ToastProvider } from './src/components/Toast';
import SheetHost from './src/navigation/SheetHost';
import MainShell from './src/navigation/MainShell';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { LoadingScreen } from './src/screens/StatusScreens';

function Root() {
  const data = useData();
  if (!data.ready) return <LoadingScreen />;
  if (!data.initialized) return <WelcomeScreen />;
  return (
    <SheetHost>
      <MainShell />
    </SheetHost>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <ToastProvider>
          <StatusBar style="dark" />
          <Root />
        </ToastProvider>
      </DataProvider>
    </SafeAreaProvider>
  );
}
