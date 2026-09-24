// Saving and opening text files on iOS and Android. The browser version is
// in files.web.js.
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

// Writes the file to the cache and opens the share sheet, so the user can
// save it to Files / Drive or send it somewhere.
export const saveTextFile = async (name, text) => {
  const uri = `${FileSystem.cacheDirectory}${name}`;
  await FileSystem.writeAsStringAsync(uri, text);
  if (!(await Sharing.isAvailableAsync())) throw new Error('Bu cihazda dosya paylaşımı desteklenmiyor.');
  await Sharing.shareAsync(uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle: name });
};

// Returns the chosen file's text, or null when the user cancels.
export const pickTextFile = async () => {
  const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
  if (result.canceled || !result.assets?.length) return null;
  return FileSystem.readAsStringAsync(result.assets[0].uri);
};
