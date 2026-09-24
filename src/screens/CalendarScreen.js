import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Screen, { ScreenHeader } from '../components/Screen';
import Icon from '../components/Icon';
import DonutChart from '../components/charts/DonutChart';
import { Card, EmptyState, IconButton, SectionHeader, Segmented } from '../components/ui';
import { useData } from '../state/DataContext';
import { useSheets } from '../navigation/sheets';
import { KINDS, KIND_ORDER } from '../domain/constants';
import { categoryBreakdown, dailyTotals, monthRange, monthTotals, savingBreakdown } from '../domain/stats';
import { WEEKDAY_SHORT, formatMonth, formatRelativeDay, isKeyInMonth, monthGrid, toDateKey, todayKey } from '../lib/dates';
import { formatCompact, formatMoney } from '../lib/money';
import { colors, font, radius, spacing } from '../theme';

function DayCell({ date, totals, isToday, isFuture, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isFuture}
      style={({ pressed }) => [styles.cell, pressed && { opacity: 0.6 }]}
      accessibilityRole="button"
      accessibilityLabel={`${date.getDate()}`}
    >
      <View style={[styles.cellInner, isToday && styles.today, totals && !isToday && styles.hasData]}>
        <View style={styles.cellTop}>
          <Text style={[styles.dayNumber, isFuture && styles.future, isToday && styles.todayText]}>{date.getDate()}</Text>
          {totals?.income ? <View style={styles.incomeDot} /> : null}
        </View>
        {totals?.spending ? (
          <Text style={[styles.cellAmount, { color: colors.spending }]} numberOfLines={1}>
            -{formatCompact(totals.spending)}
          </Text>
        ) : null}
        {totals?.saving ? (
          <Text style={[styles.cellAmount, { color: colors.saving }]} numberOfLines={1}>
            +{formatCompact(totals.saving)}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function CalendarScreen() {
  const data = useData();
  const { push } = useSheets();
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [breakdownKind, setBreakdownKind] = useState('spending');
  const today = todayKey(now);

  const daily = useMemo(() => dailyTotals(data.transactions), [data.transactions]);
  const totals = useMemo(() => monthTotals(data.transactions, view.year, view.month), [data.transactions, view]);
  const grid = useMemo(() => monthGrid(view.year, view.month), [view]);
  const breakdown = useMemo(() => {
    const [from, to] = monthRange(view.year, view.month);
    if (breakdownKind === 'saving') {
      return savingBreakdown(data.transactions, { from, to, templatesById: data.templatesById, goalsById: data.goalsById });
    }
    return categoryBreakdown(data.transactions, data.categoriesById, { kind: breakdownKind, from, to });
  }, [data.transactions, data.categoriesById, data.templatesById, data.goalsById, breakdownKind, view]);
  const activeDays = useMemo(
    () =>
      Object.keys(daily)
        .filter((key) => isKeyInMonth(key, view.year, view.month))
        .sort()
        .reverse(),
    [daily, view],
  );

  const isCurrentMonth = view.year === now.getFullYear() && view.month === now.getMonth();
  const shift = (delta) =>
    setView(({ year, month }) => {
      const date = new Date(year, month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });

  return (
    <Screen>
      <ScreenHeader title="Takvim" subtitle="Bir güne dokunarak kayıt ekle ya da düzenle" />

      <View style={styles.monthNav}>
        <IconButton icon="chevron-back" onPress={() => shift(-1)} label="Önceki ay" />
        <Pressable onPress={() => setView({ year: now.getFullYear(), month: now.getMonth() })} style={styles.monthTitleBox}>
          <Text style={styles.monthTitle}>{formatMonth(view.year, view.month)}</Text>
          {!isCurrentMonth ? <Text style={styles.backToday}>Bugüne dön</Text> : null}
        </Pressable>
        <IconButton icon="chevron-forward" onPress={() => shift(1)} label="Sonraki ay" />
      </View>

      <View style={styles.summary}>
        {[...KIND_ORDER, 'balance'].map((key) => {
          const isBalance = key === 'balance';
          const color = isBalance ? (totals.balance >= 0 ? colors.primaryDark : colors.spending) : KINDS[key].color;
          return (
            <View key={key} style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{isBalance ? 'Kalan' : KINDS[key].label}</Text>
              <Text style={[styles.summaryValue, { color }]} numberOfLines={1} adjustsFontSizeToFit>
                {formatMoney(totals[key], data.currency, { whole: true })}
              </Text>
            </View>
          );
        })}
      </View>

      <Card style={styles.section}>
        <View style={styles.weekRow}>
          {WEEKDAY_SHORT.map((day, index) => (
            <Text key={day} style={[styles.weekDay, index >= 5 && { color: colors.spending }]}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.grid}>
          {grid.map((date, index) => {
            if (!date) return <View key={`empty-${index}`} style={styles.cell} />;
            const key = toDateKey(date);
            return (
              <DayCell
                key={key}
                date={date}
                totals={daily[key]}
                isToday={key === today}
                isFuture={key > today}
                onPress={() => push('day', { date: key })}
              />
            );
          })}
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <Text style={[styles.legendSample, { color: colors.spending }]}>-</Text>
            <Text style={font.small}>Harcama</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendSample, { color: colors.saving }]}>+</Text>
            <Text style={font.small}>Birikim</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.incomeDot} />
            <Text style={font.small}>Gelir</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.section}>
        <SectionHeader title={`${formatMonth(view.year, view.month)} dağılımı`} />
        <Segmented
          value={breakdownKind}
          onChange={setBreakdownKind}
          options={KIND_ORDER.map((value) => ({ value, label: KINDS[value].plural, color: KINDS[value].color }))}
          style={{ marginBottom: spacing.lg }}
        />
        {breakdown.length ? (
          <DonutChart key={`${breakdownKind}-${view.year}-${view.month}`} slices={breakdown} currency={data.currency} />
        ) : (
          <EmptyState icon="pie-chart" title="Bu ay için kayıt yok" />
        )}
      </Card>

      {activeDays.length ? (
        <Card style={styles.section}>
          <SectionHeader title="Kayıtlı günler" />
          {activeDays.map((key) => {
            const t = daily[key];
            return (
              <Pressable key={key} onPress={() => push('day', { date: key })} style={styles.dayRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dayRowTitle}>{formatRelativeDay(key)}</Text>
                  <Text style={font.small}>{t.count} kayıt</Text>
                </View>
                <View style={styles.dayRowAmounts}>
                  {KIND_ORDER.filter((kind) => t[kind]).map((kind) => (
                    <Text key={kind} style={[styles.dayRowAmount, { color: KINDS[kind].color }]}>
                      {KINDS[kind].sign}
                      {formatMoney(t[kind], data.currency, { whole: true })}
                    </Text>
                  ))}
                </View>
                <Icon name="chevron-forward" size={16} color={colors.textFaint} />
              </Pressable>
            );
          })}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.lg },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xs,
  },
  monthTitleBox: { flex: 1, alignItems: 'center' },
  monthTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  backToday: { fontSize: 12, color: colors.primaryDark, fontWeight: '600', marginTop: 2 },
  summary: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  summaryItem: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.sm },
  summaryLabel: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  summaryValue: { fontSize: 14, fontWeight: '800', marginTop: 2 },
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekDay: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 12, fontWeight: '700', color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: 60, padding: 2 },
  cellInner: { flex: 1, borderRadius: radius.sm, paddingHorizontal: 3, paddingVertical: 3 },
  cellTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hasData: { backgroundColor: '#f8fafc' },
  today: { backgroundColor: colors.primarySoft, borderWidth: 1.5, borderColor: colors.primary },
  dayNumber: { fontSize: 13, fontWeight: '600', color: colors.text },
  todayText: { color: colors.primaryDark, fontWeight: '800' },
  future: { color: colors.textFaint },
  incomeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.income },
  cellAmount: { fontSize: 10, fontWeight: '700', marginTop: 1 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg, marginTop: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendSample: { fontSize: 15, fontWeight: '800' },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dayRowTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  dayRowAmounts: { alignItems: 'flex-end' },
  dayRowAmount: { fontSize: 13, fontWeight: '700' },
});
