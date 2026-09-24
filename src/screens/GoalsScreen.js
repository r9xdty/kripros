import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Screen, { ScreenHeader } from '../components/Screen';
import { Button, Card, EmptyState, IconCircle, ProgressBar } from '../components/ui';
import { useData } from '../state/DataContext';
import { useSheets } from '../navigation/sheets';
import { goalProgress } from '../domain/stats';
import { formatRelativeDay } from '../lib/dates';
import { formatMoney } from '../lib/money';
import { colors, font, radius, spacing } from '../theme';

const deadlineText = (progress, goal) => {
  if (!goal.target_date) return null;
  if (progress.reached) return null;
  if (progress.daysLeft < 0) return 'Hedef tarihi geçti';
  if (progress.daysLeft === 0) return 'Hedef tarihi bugün';
  return `${formatRelativeDay(goal.target_date)} · ${progress.daysLeft} gün kaldı`;
};

export default function GoalsScreen() {
  const data = useData();
  const { push } = useSheets();

  const goals = useMemo(
    () => data.goals.map((goal) => ({ goal, progress: goalProgress(goal, data.transactions) })),
    [data.goals, data.transactions],
  );
  const saved = goals.reduce((sum, g) => sum + g.progress.saved, 0);
  const target = goals.reduce((sum, g) => sum + g.progress.target, 0);

  return (
    <Screen>
      <ScreenHeader
        title="Hedefler"
        subtitle="Neye biriktirdiğini bil, ilerlemeni izle"
        right={<Button title="Yeni" icon="add" compact onPress={() => push('goal')} />}
      />

      {goals.length ? (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Hedefler için biriken</Text>
            <Text style={styles.summaryValue}>{formatMoney(saved, data.currency, { whole: true })}</Text>
            <ProgressBar ratio={target ? saved / target : 0} color="#fff" style={styles.summaryBar} />
            <Text style={styles.summaryFoot}>Toplam hedef {formatMoney(target, data.currency, { whole: true })}</Text>
          </View>

          {goals.map(({ goal, progress }) => {
            const deadline = deadlineText(progress, goal);
            return (
              <Card key={goal.id} style={styles.card}>
                <Pressable onPress={() => push('goal', { goal })} accessibilityRole="button">
                  <View style={styles.top}>
                    <IconCircle icon={goal.icon} color={goal.color} size={44} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name} numberOfLines={1}>
                        {goal.name}
                      </Text>
                      {deadline ? <Text style={font.small}>{deadline}</Text> : null}
                    </View>
                    <Text style={[styles.percent, { color: goal.color }]}>%{Math.round(progress.ratio * 100)}</Text>
                  </View>
                  <ProgressBar ratio={progress.ratio} color={goal.color} style={{ marginTop: spacing.md }} />
                  <View style={styles.amounts}>
                    <Text style={styles.saved}>{formatMoney(progress.saved, data.currency, { whole: true })}</Text>
                    <Text style={font.small}>/ {formatMoney(progress.target, data.currency, { whole: true })}</Text>
                  </View>
                  {progress.reached ? (
                    <Text style={[styles.note, { color: colors.primaryDark }]}>Hedefe ulaştın, tebrikler!</Text>
                  ) : progress.monthlyNeeded ? (
                    <Text style={styles.note}>
                      Zamanında ulaşmak için ayda {formatMoney(progress.monthlyNeeded, data.currency, { whole: true })} biriktir.
                    </Text>
                  ) : (
                    <Text style={styles.note}>Kalan {formatMoney(progress.remaining, data.currency, { whole: true })}</Text>
                  )}
                </Pressable>
                {!progress.reached ? (
                  <Button
                    title="Para ekle"
                    icon="add"
                    compact
                    variant="secondary"
                    color={goal.color}
                    style={{ marginTop: spacing.md }}
                    onPress={() => push('transaction', { kind: 'saving', goalId: goal.id })}
                  />
                ) : null}
              </Card>
            );
          })}
        </>
      ) : (
        <Card>
          <EmptyState
            icon="flag"
            title="Henüz hedefin yok"
            message="Tatil, yeni telefon, acil durum fonu… Bir hedef belirle; birikimlerini ona ekledikçe ne kadar yaklaştığını gör."
            actionLabel="İlk hedefini oluştur"
            onAction={() => push('goal')}
          />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { backgroundColor: colors.primaryDark, borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.lg },
  summaryLabel: { color: '#a7f3d0', fontSize: 13, fontWeight: '600' },
  summaryValue: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 4 },
  summaryBar: { backgroundColor: 'rgba(255,255,255,0.2)', marginTop: spacing.md },
  summaryFoot: { color: '#d1fae5', fontSize: 13, marginTop: spacing.sm },
  card: { marginBottom: spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  percent: { fontSize: 18, fontWeight: '800' },
  amounts: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: spacing.sm },
  saved: { fontSize: 17, fontWeight: '800', color: colors.text },
  note: { ...font.small, marginTop: 4 },
});
