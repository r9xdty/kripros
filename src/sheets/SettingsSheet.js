import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import SheetLayout from '../components/SheetLayout';
import Icon from '../components/Icon';
import { Banner, Button, Card, Chip, Field, SectionHeader } from '../components/ui';
import { useData } from '../state/DataContext';
import { useSheets } from '../navigation/sheets';
import { useToast } from '../components/Toast';
import { CURRENCIES } from '../lib/money';
import { confirm, notify } from '../lib/dialogs';
import { colors, font, spacing } from '../theme';

function MenuRow({ icon, title, subtitle, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.7 }]} accessibilityRole="button">
      <Icon name={icon} size={22} color={colors.primaryDark} />
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle ? <Text style={font.small}>{subtitle}</Text> : null}
      </View>
      <Icon name="chevron-forward" size={18} color={colors.textFaint} />
    </Pressable>
  );
}

export default function SettingsSheet() {
  const data = useData();
  const { push, closeAll } = useSheets();
  const toast = useToast();
  const [name, setName] = useState(data.displayName);
  const [busy, setBusy] = useState(null);

  const saveName = () => {
    const trimmed = name.trim().slice(0, 80);
    if (trimmed !== data.displayName) {
      data.updateSettings({ display_name: trimmed });
      toast('Adın güncellendi');
    }
  };

  const importLegacy = async () => {
    setBusy('import');
    try {
      const result = await data.importLegacy();
      notify('Aktarıldı', `${result.templates} alışkanlık ve ${result.transactions} birikim kaydı eklendi.`);
    } finally {
      setBusy(null);
    }
  };

  const resetAll = async () => {
    const ok = await confirm({
      title: 'Tüm verileri sil',
      message: 'Gelir, harcama, birikim, hedef ve kategorilerin bu cihazdan kalıcı olarak silinecek. Bu işlem geri alınamaz.',
      confirmText: 'Hepsini sil',
      destructive: true,
    });
    if (!ok) return;
    closeAll();
    await data.resetAll();
  };

  return (
    <SheetLayout title="Ayarlar">
      {data.legacy ? (
        <View style={{ marginBottom: spacing.lg }}>
          <Banner
            icon="phone-portrait"
            color={colors.income}
            soft={colors.incomeSoft}
            title="Eski kayıtların bulundu"
            message={`Uygulamanın önceki sürümünden ${data.legacy.entryCount} birikim kaydı bulundu.`}
          >
            <View style={styles.bannerActions}>
              <Button title="Aktar" compact loading={busy === 'import'} onPress={importLegacy} color={colors.income} />
              <Button title="Aktarma" compact variant="ghost" onPress={data.dismissLegacy} />
            </View>
          </Banner>
        </View>
      ) : null}

      <Card style={styles.card}>
        <SectionHeader title="Genel" />
        <Field
          label="Adın (isteğe bağlı)"
          value={name}
          onChangeText={setName}
          onBlur={saveName}
          onSubmitEditing={saveName}
          placeholder="Ana sayfada “Merhaba, …” diye görünür"
          maxLength={80}
          returnKeyType="done"
        />
        <Text style={styles.label}>Para birimi</Text>
        <View style={styles.chips}>
          {Object.entries(CURRENCIES).map(([code, info]) => (
            <Chip
              key={code}
              label={`${info.symbol} ${code}`}
              selected={data.currency === code}
              onPress={() => data.updateSettings({ currency: code })}
              color={colors.primaryDark}
            />
          ))}
        </View>
      </Card>

      <Card style={styles.card} padded={false}>
        <MenuRow icon="leaf" title="Birikim alışkanlıkları" subtitle={`${data.templates.length} alışkanlık`} onPress={() => push('templates')} />
        <View style={styles.divider} />
        <MenuRow icon="pricetags" title="Kategoriler" subtitle={`${data.categories.length} kategori`} onPress={() => push('categories')} />
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Hakkında" />
        <Text style={[font.small, { lineHeight: 19 }]}>
          Kripros {Constants.expoConfig?.version || ''} · Birikimlerini, harcamalarını ve gelirini tek yerde takip et. Tüm veriler
          yalnızca bu cihazda saklanır; hiçbir yere gönderilmez.
        </Text>
      </Card>

      <Button title="Tüm verileri sil" icon="trash-outline" variant="danger" onPress={resetAll} />
    </SheetLayout>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  bannerActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  label: { ...font.label, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  menuTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 54 },
});
