import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import SheetLayout from '../components/SheetLayout';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';
import { describeSync } from '../components/SyncBadge';
import { Banner, Button, Card, Chip, Field, SectionHeader } from '../components/ui';
import { useAuth } from '../state/AuthContext';
import { useData } from '../state/DataContext';
import { useSheets } from '../navigation/sheets';
import { useToast } from '../components/Toast';
import { CURRENCIES } from '../lib/money';
import { confirm, notify } from '../lib/dialogs';
import { DEMO_MODE } from '../config';
import { colors, font, radius, spacing } from '../theme';

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

export default function ProfileSheet() {
  const auth = useAuth();
  const data = useData();
  const { push, closeAll } = useSheets();
  const toast = useToast();
  const [name, setName] = useState(data.displayName || '');
  const [busy, setBusy] = useState(null);
  const syncInfo = describeSync(data.sync);

  const saveName = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== data.displayName) {
      data.updateProfile({ display_name: trimmed.slice(0, 80) });
      toast('Adın güncellendi');
    }
  };

  const importLegacy = async () => {
    setBusy('import');
    try {
      const result = await data.importLegacy();
      notify('Aktarıldı', `${result.templates} alışkanlık ve ${result.transactions} birikim kaydı hesabına eklendi.`);
    } finally {
      setBusy(null);
    }
  };

  const signOut = async () => {
    if (DEMO_MODE) {
      notify('Demo modu', 'Demo modunda çıkış yapılmaz.');
      return;
    }
    setBusy('signout');
    try {
      if (data.sync.online && data.unsyncedCount() > 0) await data.syncNow();
      const unsynced = data.unsyncedCount();
      const ok = await confirm({
        title: 'Çıkış yap',
        message: unsynced
          ? `${unsynced} değişiklik henüz sunucuya gönderilemedi. Çıkış yaparsan bu değişiklikler kaybolur.`
          : 'Verilerin hesabında güvende. Tekrar giriş yaptığında hepsi geri gelir.',
        confirmText: 'Çıkış yap',
        destructive: unsynced > 0,
      });
      if (!ok) return;
      closeAll();
      await data.clearLocalData();
      await auth.signOut();
    } finally {
      setBusy(null);
    }
  };

  const deleteAccount = async () => {
    if (DEMO_MODE) {
      notify('Demo modu', 'Demo modunda hesap silinmez.');
      return;
    }
    if (!data.sync.online) {
      notify('Bağlantı gerekli', 'Hesabını silmek için internete bağlanman gerekiyor.');
      return;
    }
    const ok = await confirm({
      title: 'Hesabı kalıcı olarak sil',
      message: 'Hesabın ve tüm kayıtların (gelir, harcama, birikim, hedefler) sunucudan ve bu cihazdan silinecek. Bu işlem geri alınamaz.',
      confirmText: 'Hesabımı sil',
      destructive: true,
    });
    if (!ok) return;
    setBusy('delete');
    try {
      await auth.deleteAccount();
      closeAll();
      await data.clearLocalData();
      await auth.signOut();
    } catch (error) {
      notify('Hesap silinemedi', error.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <SheetLayout title="Profil ve ayarlar">
      <View style={styles.identity}>
        <Avatar name={data.displayName} url={auth.user.avatarUrl} size={72} />
        <Text style={styles.name}>{data.displayName}</Text>
        {auth.user.email ? <Text style={font.small}>{auth.user.email}</Text> : null}
        <View style={[styles.plan, data.plan === 'premium' && styles.planPremium]}>
          <Icon name={data.plan === 'premium' ? 'star' : 'person'} size={14} color={data.plan === 'premium' ? colors.warning : colors.textMuted} />
          <Text style={styles.planText}>{data.plan === 'premium' ? 'Premium üyelik' : 'Ücretsiz plan'}</Text>
        </View>
      </View>

      {data.legacy ? (
        <View style={{ marginBottom: spacing.lg }}>
          <Banner
            icon="phone-portrait"
            color={colors.income}
            soft={colors.incomeSoft}
            title="Cihazında eski kayıtlar var"
            message={`Uygulamanın önceki sürümünden ${data.legacy.entryCount} birikim kaydı bulundu. Hesabına aktarırsan tüm cihazlarında görünür.`}
          >
            <View style={styles.bannerActions}>
              <Button title="Hesabıma aktar" compact loading={busy === 'import'} onPress={importLegacy} color={colors.income} />
              <Button title="Aktarma" compact variant="ghost" onPress={data.dismissLegacy} />
            </View>
          </Banner>
        </View>
      ) : null}

      <Card style={styles.card}>
        <SectionHeader title="Eşitleme" />
        <View style={styles.syncRow}>
          <Icon name={syncInfo.icon} size={22} color={syncInfo.color} />
          <Text style={[font.body, { flex: 1 }]}>{syncInfo.long}</Text>
        </View>
        <Text style={[font.small, { marginTop: spacing.sm }]}>
          Uygulama internet olmadan da çalışır; değişikliklerin bağlantı geldiğinde otomatik olarak gönderilir.
        </Text>
        <View style={styles.buttonsRow}>
          <Button
            title="Şimdi eşitle"
            icon="sync"
            compact
            variant="secondary"
            disabled={!data.sync.online}
            loading={data.sync.state === 'syncing'}
            onPress={data.syncNow}
            style={{ flex: 1 }}
          />
          {data.sync.failed ? (
            <Button title="Tekrar dene" icon="refresh" compact variant="danger" onPress={data.retryFailed} style={{ flex: 1 }} />
          ) : null}
        </View>
      </Card>

      <Card style={styles.card}>
        <SectionHeader title="Ayarlar" />
        <Field label="Görünen ad" value={name} onChangeText={setName} onBlur={saveName} onSubmitEditing={saveName} maxLength={80} returnKeyType="done" />
        <Text style={styles.label}>Para birimi</Text>
        <View style={styles.chips}>
          {Object.entries(CURRENCIES).map(([code, info]) => (
            <Chip
              key={code}
              label={`${info.symbol} ${code}`}
              selected={data.currency === code}
              onPress={() => data.updateProfile({ currency: code })}
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
        <Text style={font.small}>
          Kripros {Constants.expoConfig?.version || ''} · Birikimlerini, harcamalarını ve gelirini tek yerde takip et. Verilerin hesabına
          bağlı olarak güvenle saklanır; yalnızca sen görebilirsin.
        </Text>
      </Card>

      <Button title="Çıkış yap" icon="log-out-outline" variant="secondary" loading={busy === 'signout'} onPress={signOut} />
      <Button
        title="Hesabımı sil"
        icon="trash-outline"
        variant="danger"
        loading={busy === 'delete'}
        onPress={deleteAccount}
        style={{ marginTop: spacing.md }}
      />
    </SheetLayout>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', marginBottom: spacing.xl, gap: 4 },
  name: { ...font.title, marginTop: spacing.sm },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
  },
  planPremium: { backgroundColor: colors.warningSoft },
  planText: { fontSize: 13, fontWeight: '600', color: colors.text },
  card: { marginBottom: spacing.lg },
  syncRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  buttonsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  bannerActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  label: { ...font.label, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  menuTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 54 },
});
