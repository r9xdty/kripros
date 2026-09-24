import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import SheetLayout from '../components/SheetLayout';
import Icon from '../components/Icon';
import { Banner, Button, Card, Chip, Field, SectionHeader } from '../components/ui';
import { useData } from '../state/DataContext';
import { useSheets } from '../navigation/sheets';
import { useToast } from '../components/Toast';
import { CURRENCIES } from '../lib/money';
import { confirm, notify } from '../lib/dialogs';
import { formatRelativeDay, toDateKey } from '../lib/dates';
import { BackupError } from '../domain/backup';
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

  const budgets = data.categories.filter((c) => c.kind === 'spending' && c.monthly_budget > 0).length;
  const categoriesSubtitle = `${data.categories.length} kategori${budgets ? ` · ${budgets} bütçe` : ''}`;

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

  const exportBackup = async () => {
    setBusy('export');
    try {
      await data.exportBackup();
      // On phones the share sheet already shows what happened.
      if (Platform.OS === 'web') toast('Yedek dosyası indirildi', { icon: 'download' });
    } catch (error) {
      notify('Yedek alınamadı', error?.message);
    } finally {
      setBusy(null);
    }
  };

  const restoreBackup = async () => {
    let backup;
    try {
      backup = await data.readBackupFile();
    } catch (error) {
      notify('Yedek açılamadı', error instanceof BackupError ? error.message : 'Dosya okunamadı.');
      return;
    }
    if (!backup) return;
    const { transactions, goals, categories } = backup.counts;
    const date = backup.exportedAt ? new Date(backup.exportedAt) : null;
    const from = date && !Number.isNaN(date.getTime()) ? `${formatRelativeDay(toDateKey(date))} tarihli yedekte` : 'Yedekte';
    const ok = await confirm({
      title: 'Yedekten geri yükle',
      message: `${from} ${transactions} kayıt, ${goals} hedef ve ${categories} kategori var. Bu cihazdaki tüm veriler yedektekilerle değiştirilecek.`,
      confirmText: 'Geri yükle',
      destructive: true,
    });
    if (!ok) return;
    setBusy('restore');
    try {
      await data.restoreBackup(backup);
      closeAll();
      toast('Yedek geri yüklendi');
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
        <MenuRow icon="pricetags" title="Kategoriler ve bütçeler" subtitle={categoriesSubtitle} onPress={() => push('categories')} />
        <View style={styles.divider} />
        <MenuRow
          icon="repeat"
          title="Düzenli işlemler"
          subtitle={data.recurring.length ? `${data.recurring.length} düzenli işlem` : 'Maaş, kira, abonelik…'}
          onPress={() => push('recurring')}
        />
      </Card>

      {data.backupsEnabled ? (
        <Card style={styles.card}>
          <SectionHeader title="Yedekleme" />
          <Text style={[font.small, styles.paragraph]}>
            Tüm kayıtların tek bir dosyaya yazılır. Telefon değiştirirken ya da uygulamayı silmeden önce yedek al, sonra buradan
            geri yükle.
          </Text>
          <View style={styles.backupActions}>
            <Button
              title="Yedek al"
              icon="download-outline"
              variant="secondary"
              compact
              loading={busy === 'export'}
              onPress={exportBackup}
              style={{ flex: 1 }}
            />
            <Button
              title="Geri yükle"
              icon="folder-open-outline"
              variant="secondary"
              compact
              loading={busy === 'restore'}
              onPress={restoreBackup}
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      ) : null}

      <Card style={styles.card}>
        <SectionHeader title="Hakkında" />
        <Text style={[font.small, styles.paragraph]}>
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
  paragraph: { lineHeight: 19 },
  backupActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  menuTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 54 },
});
