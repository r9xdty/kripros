import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/state/AuthContext';
import { DataProvider, useData } from './src/state/DataContext';
import { ToastProvider } from './src/components/Toast';
import SheetHost from './src/navigation/SheetHost';
import MainShell from './src/navigation/MainShell';
import LoginScreen from './src/screens/LoginScreen';
import { FirstSyncScreen, LoadingScreen, SetupScreen } from './src/screens/StatusScreens';

function SignedInApp() {
  const data = useData();
  const auth = useAuth();
  if (!data.ready) return <LoadingScreen message="Verilerin açılıyor…" />;
  if (!data.initialSyncDone) {
    return (
      <FirstSyncScreen
        sync={data.sync}
        onRetry={data.syncNow}
        onSignOut={async () => {
          await data.clearLocalData();
          await auth.signOut();
        }}
      />
    );
  }
  return (
    <SheetHost>
      <MainShell />
    </SheetHost>
  );
}

function Root() {
  const auth = useAuth();
  switch (auth.status) {
    case 'unconfigured':
      return <SetupScreen />;
    case 'signedOut':
      return <LoginScreen />;
    case 'signedIn':
      return (
        <DataProvider key={auth.user.id} user={auth.user}>
          <SignedInApp />
        </DataProvider>
      );
    default:
      return <LoadingScreen />;
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
          <StatusBar style="dark" />
          <Root />
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
