import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DataProvider, useData } from './src/state/DataContext';
import { ToastProvider } from './src/components/Toast';
import WebFrame from './src/components/WebFrame';
import SheetHost from './src/navigation/SheetHost';
import MainShell from './src/navigation/MainShell';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import { hideSplash } from './src/lib/splash';

function Root() {
  const data = useData();
  useEffect(() => {
    if (data.ready) hideSplash();
  }, [data.ready]);
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
      <WebFrame>
        <DataProvider>
          <ToastProvider>
            <StatusBar style="dark" />
            <Root />
          </ToastProvider>
        </DataProvider>
      </WebFrame>
    </SafeAreaProvider>
  );
}
