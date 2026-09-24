import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Screen, { ScreenHeader } from '../components/Screen';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';
import TransactionRow from '../components/TransactionRow';
import GroupedBarChart from '../components/charts/GroupedBarChart';
import DonutChart from '../components/charts/DonutChart';
import { Banner, Button, Card, Chip, EmptyState, IconCircle, ProgressBar, SectionHeader, Segmented } from '../components/ui';
import { useData } from '../state/DataContext';
import { useSheets } from '../navigation/sheets';
import { useToast } from '../components/Toast';
import { KINDS, KIND_ORDER } from '../domain/constants';
import {
  CHART_RANGES,
  buildSeries,
  categoryBreakdown,
  goalProgress,
  monthRange,
  monthTotals,
  savingBreakdown,
  savingStreak,
  savingsRate,
  spendingComparison,
} from '../domain/stats';
import { budgetStatus } from '../domain/budgets';
import { upcoming } from '../domain/recurring';
import { recommendTemplates } from '../domain/recommendations';
import { formatMonth, formatRelativeDay, fromDateKey, todayKey } from '../lib/dates';
import { formatMoney } from '../lib/money';
import { colors, font, radius, spacing } from '../theme';

const firstName = (name) => (name || '').split(/\s+/)[0];

const BUDGET_COLORS = { ok: colors.primary, warn: colors.warning, over: colors.danger };

// "Harcama geçen ayın aynı dönemine göre %12 az"
const comparisonText = (change) => {
  const percent = Math.round(Math.abs(change) * 100);
  if (percent === 0) return 'Harcama geçen ayın aynı dönemiyle neredeyse aynı';
  return `Harcama geçen ayın aynı dönemine göre %${percent} ${change < 0 ? 'az' : 'fazla'}`;
};

function HeroPill({ icon, text }) {
  return (
    <View style={styles.heroPill}>
      <Icon name={icon} size={14} color="#fff" />
      <Text style={styles.heroPillText}>{text}</Text>
    </View>
  );
}

function HeroCard({ totals, rate, streak, comparison, currency }) {
  return (
    <View style={styles.hero}>
      <Text style={styles.heroLabel}>Bu ay kalan (gelir − harcama)</Text>
      <Text style={styles.heroValue} numberOfLines={1} adjustsFontSizeToFit>
        {formatMoney(totals.balance, currency)}
      </Text>
      <View style={styles.heroStats}>
        {['income', 'spending', 'saving'].map((kind) => (
          <View key={kind} style={styles.heroStat}>
            <View style={styles.heroStatTop}>
              <View style={[styles.heroDot, { backgroundColor: KINDS[kind].soft }]} />
              <Text style={styles.heroStatLabel}>{KINDS[kind].label}</Text>
            </View>
            <Text style={styles.heroStatValue} numberOfLines={1} adjustsFontSizeToFit>
              {formatMoney(totals[kind], currency, { whole: true })}
            </Text>
          </View>
        ))}
      </View>
      {rate !== null || streak > 1 || comparison.change !== null ? (
        <View style={styles.heroFooter}>
          {comparison.change !== null ? (
            <HeroPill icon={comparison.change > 0 ? 'trending-up' : 'trending-down'} text={comparisonText(comparison.change)} />
          ) : null}
          {rate !== null ? <HeroPill icon="pie-chart" text={`Birikim oranı %${Math.round(rate * 100)}`} /> : null}
          {streak > 1 ? <HeroPill icon="flame" text={`${streak} gündür birikim yapıyorsun`} /> : null}
        </View>
      ) : null}
    </View>
  );
}

export default function DashboardScreen({ onNavigate }) {
  const data = useData();
  const { push } = useSheets();
  const toast = useToast();
  const [range, setRange] = useState('week');
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [breakdownKind, setBreakdownKind] = useState('spending');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = todayKey(now);

  const totals = useMemo(() => monthTotals(data.transactions, year, month), [data.transactions, year, month]);
  const streak = useMemo(() => savingStreak(data.transactions, fromDateKey(today)), [data.transactions, today]);
  const comparison = useMemo(() => spendingComparison(data.transactions, fromDateKey(today)), [data.transactions, today]);
  const budgets = useMemo(() => budgetStatus(data.categories, data.transactions, year, month), [data.categories, data.transactions, year, month]);
  const nextRecurring = useMemo(() => upcoming(data.recurring, today, 30).slice(0, 4), [data.recurring, today]);
  const series = useMemo(() => buildSeries(data.transactions, range), [data.transactions, range]);
  const bucketIndex = selectedBucket ?? series.length - 1;
  const bucket = series[bucketIndex];

  const breakdown = useMemo(() => {
    const [from, to] = monthRange(year, month);
    if (breakdownKind === 'saving') {
      return savingBreakdown(data.transactions, { from, to, templatesById: data.templatesById, goalsById: data.goalsById });
    }
    return categoryBreakdown(data.transactions, data.categoriesById, { kind: breakdownKind, from, to });
  }, [data.transactions, data.categoriesById, data.templatesById, data.goalsById, breakdownKind, year, month]);

  const suggestions = useMemo(
    () => recommendTemplates(data.templates, data.transactions, today, { limit: 4 }),
    [data.templates, data.transactions, today],
  );

  const quickAdd = (template) => {
    data.saveTransaction({ kind: 'saving', amount: template.amount, title: template.name, template_id: template.id, occurred_on: today });
    toast(`${template.name} eklendi`);
  };

  const recent = data.transactions.slice(0, 5);
  const goals = data.goals.slice(0, 2);
  const isEmpty = data.transactions.length === 0;

  return (
    <Screen>
      <ScreenHeader
        title={`Merhaba${data.displayName ? `, ${firstName(data.displayName)}` : ''}`}
        subtitle={formatMonth(year, month)}
        right={
          <Pressable onPress={() => push('settings')} accessibilityLabel="Ayarlar" hitSlop={6}>
            {data.displayName ? (
              <Avatar name={data.displayName} size={40} />
            ) : (
              <View style={styles.settingsButton}>
                <Icon name="settings-outline" size={22} color={colors.primaryDark} />
              </View>
            )}
          </Pressable>
        }
      />

      {data.legacy ? (
        <View style={styles.section}>
          <Banner
            icon="phone-portrait"
            color={colors.income}
            soft={colors.incomeSoft}
            title="Eski kayıtların bulundu"
            message={`Cihazında önceki sürümden ${data.legacy.entryCount} birikim kaydı var.`}
          >
            <Button title="Ayarlar’dan aktar" compact variant="ghost" onPress={() => push('settings')} style={{ alignSelf: 'flex-start' }} />
          </Banner>
        </View>
      ) : null}

      <HeroCard totals={totals} rate={savingsRate(totals)} streak={streak} comparison={comparison} currency={data.currency} />

      <View style={[styles.quickRow, styles.section]}>
        {KIND_ORDER.map((kind) => (
          <Pressable
            key={kind}
            onPress={() => push('transaction', { kind })}
            style={({ pressed }) => [styles.quick, { backgroundColor: KINDS[kind].soft }, pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel={`${KINDS[kind].label} ekle`}
          >
            <Icon name="add-circle" size={24} color={KINDS[kind].color} />
            <Text style={[styles.quickText, { color: KINDS[kind].color }]}>{KINDS[kind].label}</Text>
          </Pressable>
        ))}
      </View>

      {suggestions.length ? (
        <Card style={styles.section}>
          <SectionHeader title="Bugün için öneriler" actionLabel="Düzenle" onAction={() => push('templates')} />
          <View style={styles.chips}>
            {suggestions.map(({ template }) => (
              <Chip
                key={template.id}
                icon="add-circle"
                color={colors.saving}
                label={`${template.name} · ${formatMoney(template.amount, data.currency, { whole: true })}`}
                onPress={() => quickAdd(template)}
              />
            ))}
          </View>
        </Card>
      ) : data.templates.length === 0 ? (
        <Card style={styles.section}>
          <SectionHeader title="Birikim alışkanlıkları" />
          <Text style={font.small}>
            “Kahve almadım · 85 ₺” gibi sık yaptığın tasarrufları kaydet, her gün tek dokunuşla ekle.
          </Text>
          <Button title="Alışkanlık ekle" icon="leaf" compact variant="secondary" style={{ marginTop: spacing.md, alignSelf: 'flex-start' }} onPress={() => push('templates')} />
        </Card>
      ) : null}

      <Card style={styles.section}>
        <SectionHeader title="Genel bakış" />
        <Segmented
          value={range}
          onChange={(value) => {
            setRange(value);
            setSelectedBucket(null);
          }}
          options={Object.entries(CHART_RANGES).map(([value, label]) => ({ value, label }))}
          style={{ marginBottom: spacing.lg }}
        />
        <GroupedBarChart data={series} kinds={['income', 'spending', 'saving']} selectedIndex={bucketIndex} onSelect={setSelectedBucket} />
        {bucket ? (
          <View style={styles.bucketSummary}>
            {['income', 'spending', 'saving'].map((kind) => (
              <View key={kind} style={styles.bucketItem}>
                <View style={[styles.legendDot, { backgroundColor: KINDS[kind].color }]} />
                <View>
                  <Text style={font.small}>{KINDS[kind].label}</Text>
                  <Text style={styles.bucketValue}>{formatMoney(bucket[kind], data.currency, { whole: true })}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </Card>

      {budgets.length ? (
        <Card style={styles.section}>
          <SectionHeader title="Bütçeler" actionLabel="Düzenle" onAction={() => push('categories', { kind: 'spending' })} />
          {budgets.map((item) => (
            <View key={item.category.id} style={styles.budgetRow}>
              <View style={styles.budgetTop}>
                <Icon name={item.category.icon} size={18} color={item.category.color} />
                <Text style={styles.budgetName} numberOfLines={1}>
                  {item.category.name}
                </Text>
                <Text style={styles.budgetAmounts}>
                  {formatMoney(item.spent, data.currency, { whole: true })}
                  <Text style={font.small}> / {formatMoney(item.budget, data.currency, { whole: true })}</Text>
                </Text>
              </View>
              <ProgressBar ratio={item.ratio} color={BUDGET_COLORS[item.state]} height={8} />
              <Text style={[font.small, styles.budgetNote, item.state === 'over' && { color: colors.danger, fontWeight: '600' }]}>
                {item.state === 'over'
                  ? `${formatMoney(item.spent - item.budget, data.currency, { whole: true })} aşıldı`
                  : `${formatMoney(item.remaining, data.currency, { whole: true })} kaldı · %${Math.round(item.ratio * 100)}`}
              </Text>
            </View>
          ))}
        </Card>
      ) : !isEmpty ? (
        <Card style={styles.section}>
          <SectionHeader title="Bütçeler" />
          <Text style={font.small}>Market, yeme-içme gibi kategorilere aylık sınır koy; %80’e ve sınıra gelince haber verelim.</Text>
          <Button
            title="Bütçe belirle"
            icon="speedometer"
            compact
            variant="secondary"
            style={{ marginTop: spacing.md, alignSelf: 'flex-start' }}
            onPress={() => push('categories', { kind: 'spending' })}
          />
        </Card>
      ) : null}

      <Card style={styles.section}>
        <SectionHeader title="Bu ayın dağılımı" />
        <Segmented
          value={breakdownKind}
          onChange={setBreakdownKind}
          options={KIND_ORDER.map((value) => ({ value, label: KINDS[value].plural, color: KINDS[value].color }))}
          style={{ marginBottom: spacing.lg }}
        />
        {breakdown.length ? (
          <DonutChart key={breakdownKind} slices={breakdown} currency={data.currency} centerLabel={`Toplam ${KINDS[breakdownKind].label.toLocaleLowerCase('tr')}`} />
        ) : (
          <EmptyState icon="pie-chart" title={`Bu ay ${KINDS[breakdownKind].label.toLocaleLowerCase('tr')} kaydı yok`} />
        )}
      </Card>

      {nextRecurring.length ? (
        <Card style={styles.section}>
          <SectionHeader title="Yaklaşan düzenli işlemler" actionLabel="Düzenle" onAction={() => push('recurring')} />
          {nextRecurring.map((rule) => {
            const category = rule.category_id ? data.categoriesById[rule.category_id] : null;
            const kind = KINDS[rule.kind];
            return (
              <View key={rule.id} style={styles.upcomingRow}>
                <IconCircle icon={category?.icon || 'repeat'} color={category?.color || kind.color} size={36} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.upcomingTitle} numberOfLines={1}>
                    {rule.title}
                  </Text>
                  <Text style={font.small}>{formatRelativeDay(rule.next_on)}</Text>
                </View>
                <Text style={[styles.upcomingAmount, { color: kind.color }]}>
                  {kind.sign}
                  {formatMoney(rule.amount, data.currency, { whole: true })}
                </Text>
              </View>
            );
          })}
        </Card>
      ) : null}

      <Card style={styles.section}>
        <SectionHeader title="Hedefler" actionLabel={data.goals.length ? 'Tümü' : null} onAction={() => onNavigate('goals')} />
        {goals.length ? (
          goals.map((goal) => {
            const progress = goalProgress(goal, data.transactions);
            return (
              <Pressable key={goal.id} onPress={() => push('goal', { goal })} style={styles.goalRow}>
                <View style={styles.goalTop}>
                  <Icon name={goal.icon} size={18} color={goal.color} />
                  <Text style={styles.goalName} numberOfLines={1}>
                    {goal.name}
                  </Text>
                  <Text style={styles.goalPercent}>%{Math.round(progress.ratio * 100)}</Text>
                </View>
                <ProgressBar ratio={progress.ratio} color={goal.color} height={8} />
                <Text style={[font.small, { marginTop: 4 }]}>
                  {formatMoney(progress.saved, data.currency, { whole: true })} / {formatMoney(progress.target, data.currency, { whole: true })}
                </Text>
              </Pressable>
            );
          })
        ) : (
          <EmptyState icon="flag" title="Bir hedef belirle" message="Tatil, araba, acil durum fonu… Hedef koy, ilerlemeni izle." actionLabel="Hedef oluştur" onAction={() => push('goal')} />
        )}
      </Card>

      <Card style={styles.section}>
        <SectionHeader title="Son kayıtlar" actionLabel={isEmpty ? null : 'Tümü'} onAction={() => onNavigate('history')} />
        {isEmpty ? (
          <EmptyState icon="receipt" title="Henüz kayıt yok" message="İlk harcamanı, gelirini ya da birikimini yukarıdaki düğmelerle ekle." />
        ) : (
          recent.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} lookups={data} currency={data.currency} showDate onPress={() => push('transaction', { transaction: tx })} />
          ))
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginTop: spacing.lg },
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  heroLabel: { color: '#a7f3d0', fontSize: 13, fontWeight: '600' },
  heroValue: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 4 },
  heroStats: { flexDirection: 'row', marginTop: spacing.lg, gap: spacing.sm },
  heroStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.md, padding: spacing.md },
  heroStatTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroDot: { width: 8, height: 8, borderRadius: 4 },
  heroStatLabel: { color: '#d1fae5', fontSize: 12, fontWeight: '600' },
  heroStatValue: { color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 4 },
  heroFooter: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: '100%',
  },
  heroPillText: { color: '#fff', fontSize: 12, fontWeight: '600', flexShrink: 1 },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quick: { flex: 1, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center', gap: 4 },
  quickText: { fontSize: 14, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  bucketSummary: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.sm },
  bucketItem: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  bucketValue: { fontSize: 15, fontWeight: '700', color: colors.text },
  budgetRow: { paddingVertical: spacing.sm },
  budgetTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 6 },
  budgetName: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  budgetAmounts: { fontSize: 14, fontWeight: '700', color: colors.text },
  budgetNote: { marginTop: 4 },
  upcomingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  upcomingTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  upcomingAmount: { fontSize: 15, fontWeight: '700' },
  goalRow: { paddingVertical: spacing.sm },
  goalTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 6 },
  goalName: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  goalPercent: { fontSize: 14, fontWeight: '700', color: colors.text },
});
