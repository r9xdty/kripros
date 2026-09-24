import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader, TAB_BAR_HEIGHT } from '../components/Screen';
import Icon from '../components/Icon';
import TransactionRow, { describeTransaction } from '../components/TransactionRow';
import { Chip, EmptyState } from '../components/ui';
import { useData } from '../state/DataContext';
import { useSheets } from '../navigation/sheets';
import { KINDS, KIND_ORDER } from '../domain/constants';
import { formatRelativeDay } from '../lib/dates';
import { formatMoney } from '../lib/money';
import { colors, radius, spacing } from '../theme';

const normalize = (text) => (text || '').toLocaleLowerCase('tr');

export default function HistoryScreen() {
  const data = useData();
  const { push } = useSheets();
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState('all');
  const [query, setQuery] = useState('');

  // Flattened list of day headers and rows, so it stays virtualised.
  const items = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = data.transactions.filter((tx) => {
      if (kind !== 'all' && tx.kind !== kind) return false;
      if (!q) return true;
      const info = describeTransaction(tx, data);
      return [info.title, info.subtitle, tx.note].some((text) => normalize(text).includes(q));
    });
    const out = [];
    let header = null;
    for (const tx of filtered) {
      if (!header || header.day !== tx.occurred_on) {
        header = { type: 'header', key: `h-${tx.occurred_on}`, day: tx.occurred_on, net: 0 };
        out.push(header);
      }
      const delta = tx.kind === 'income' ? tx.amount : tx.kind === 'spending' ? -tx.amount : 0;
      header.net = Math.round((header.net + delta) * 100) / 100;
      out.push({ type: 'row', key: tx.id, tx });
    }
    return out;
  }, [data, kind, query]);

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{formatRelativeDay(item.day)}</Text>
          {item.net ? (
            <Text style={[styles.dayNet, { color: item.net > 0 ? colors.income : colors.spending }]}>
              {formatMoney(item.net, data.currency, { sign: true, whole: true })}
            </Text>
          ) : null}
        </View>
      );
    }
    return (
      <View style={styles.rowWrap}>
        <TransactionRow tx={item.tx} lookups={data} currency={data.currency} onPress={() => push('transaction', { transaction: item.tx })} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.top}>
        <ScreenHeader title="Geçmiş" subtitle={`${data.transactions.length} kayıt`} />
        <View style={styles.search}>
          <Icon name="search" size={18} color={colors.textFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Ara: açıklama, kategori, not"
            placeholderTextColor={colors.textFaint}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <View style={styles.filters}>
          <Chip label="Tümü" selected={kind === 'all'} onPress={() => setKind('all')} color={colors.text} />
          {KIND_ORDER.map((value) => (
            <Chip
              key={value}
              label={KINDS[value].plural}
              selected={kind === value}
              onPress={() => setKind(value)}
              color={KINDS[value].color}
            />
          ))}
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.xl }}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={20}
        ListEmptyComponent={
          <EmptyState
            icon={query ? 'search' : 'receipt'}
            title={query ? 'Sonuç bulunamadı' : 'Henüz kayıt yok'}
            message={query ? 'Farklı bir kelimeyle aramayı dene.' : 'Eklediğin gelir, harcama ve birikimler burada listelenir.'}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.lg },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: colors.text },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginVertical: spacing.md },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  dayTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },
  dayNet: { fontSize: 13, fontWeight: '700' },
  rowWrap: { backgroundColor: colors.card, paddingHorizontal: spacing.md, borderRadius: radius.md, marginTop: 6 },
});
