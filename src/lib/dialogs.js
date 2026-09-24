// Alert.alert does nothing on react-native-web, so fall back to the
// browser's dialogs there.
import { Alert, Platform } from 'react-native';

export const confirm = ({ title, message, confirmText = 'Tamam', cancelText = 'Vazgeç', destructive = false }) =>
  new Promise((resolve) => {
    if (Platform.OS === 'web') {
      resolve(window.confirm([title, message].filter(Boolean).join('\n\n')));
      return;
    }
    Alert.alert(
      title,
      message,
      [
        { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
        { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });

export const notify = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert([title, message].filter(Boolean).join('\n\n'));
    return;
  }
  Alert.alert(title, message);
};
