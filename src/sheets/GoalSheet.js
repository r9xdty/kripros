import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SheetLayout from '../components/SheetLayout';
import TransactionRow from '../components/TransactionRow';
import Icon from '../components/Icon';
import { Button, Card, Chip, Field, IconButton, ProgressBar, SectionHeader } from '../components/ui';
import { useData } from '../state/DataContext';
import { useSheets } from '../navigation/sheets';
import { useToast } from '../components/Toast';
import { GOAL_ICONS, PALETTE } from '../domain/constants';
import { goalProgress } from '../domain/stats';
import { amountToInput, formatMoney, parseAmount } from '../lib/money';
import { addMonths, fromDateKey, parseDisplayDate, toDateKey, toDisplayDate, todayKey } from '../lib/dates';
import { confirm } from '../lib/dialogs';
import { colors, font, spacing } from '../theme';

const DATE_PRESETS = [
  [3, '3 ay'],
  [6, '6 ay'],
  [12, '1 yıl'],
  [24, '2 yıl'],
];

const presetDate = (months) => {
  const today = fromDateKey(todayKey());
  const target = addMonths(today, months);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return toDateKey(new Date(target.getFullYear(), target.getMonth(), Math.min(today.getDate(), lastDay)));
};

export default function GoalSheet({ goal }) {
  const data = useData();
  const { pop, push } = useSheets();
  const toast = useToast();
  const editing = Boolean(goal);
  const current = editing ? data.goalsById[goal.id] || goal : null;

  const [name, setName] = useState(current?.name || '');
  const [targetText, setTargetText] = useState(current ? amountToInput(current.target_amount) : '');
  const [initialText, setInitialText] = useState(current?.initial_amount ? amountToInput(current.initial_amount) : '');
  const [dateText, setDateText] = useState(toDisplayDate(current?.target_date));
  const [icon, setIcon] = useState(current?.icon || 'flag');
  const [color, setColor] = useState(current?.color || PALETTE[0]);
  const [errors, setErrors] = useState({});

  const contributions = useMemo(
    () => (editing ? data.transactions.filter((tx) => tx.kind === 'saving' && tx.goal_id === goal.id) : []),
    [editing, data.transactions, goal],
  );
  const progress = current ? goalProgress(current, data.transactions) : null;

  const save = () => {
    const target = parseAmount(targetText);
    const initial = initialText.trim() ? parseAmount(initialText) : 0;
    const targetDate = dateText.trim() ? parseDisplayDate(dateText) : null;
    const next = {};
    if (!name.trim()) next.name = 'Hedefe bir ad ver.';
    if (!(target > 0)) next.target = 'Geçerli bir hedef tutarı gir.';
    if (Number.isNaN(initial) || initial < 0) next.initial = 'Geçerli bir tutar gir.';
    if (dateText.trim() && !targetDate) next.date = 'Tarihi GG.AA.YYYY biçiminde yaz.';
    setErrors(next);
    if (Object.keys(next).length) return;

    data.saveGoal({
      ...(current ? { id: current.id } : {}),
      name,
      target_amount: target,
      initial_amount: initial,
      target_date: targetDate,
      icon,
      color,
    });
    toast(editing ? 'Hedef güncellendi' : 'Hedef oluşturuldu');
    pop();
  };

  const remove = async () => {
    const ok = await confirm({
      title: 'Hedefi sil',
      message: 'Hedef silinir; bu hedefe eklediğin birikim kayıtları geçmişte kalmaya devam eder.',
      confirmText: 'Sil',
      destructive: true,
    });
    if (!ok) return;
    data.deleteGoal(current.id);
    toast('Hedef silindi', { icon: 'trash' });
    pop();
  };

  return (
    <SheetLayout
      title={editing ? current.name : 'Yeni hedef'}
      right={editing ? <IconButton icon="trash-outline" color={colors.danger} onPress={remove} label="Hedefi sil" /> : null}
      footer={<Button title={editing ? 'Kaydet' : 'Hedefi oluştur'} onPress={save} icon="checkmark" color={color} />}
    >
      {progress ? (
        <Card style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressSaved}>{formatMoney(progress.saved, data.currency, { whole: true })}</Text>
            <Text style={styles.progressTarget}>/ {formatMoney(progress.target, data.currency, { whole: true })}</Text>
          </View>
          <ProgressBar ratio={progress.ratio} color={current.color} style={{ marginVertical: spacing.sm }} />
          <Text style={font.small}>
            {progress.reached
              ? 'Tebrikler, hedefe ulaştın!'
              : `Kalan ${formatMoney(progress.remaining, data.currency, { whole: true })}${
                  progress.monthlyNeeded ? ` · ayda ${formatMoney(progress.monthlyNeeded, data.currency, { whole: true })} biriktirmen yeterli` : ''
                }`}
          </Text>
          <Button
            title="Bu hedefe para ekle"
            icon="add"
            compact
            color={current.color}
            style={{ marginTop: spacing.md }}
            onPress={() => push('transaction', { kind: 'saving', goalId: current.id })}
          />
        </Card>
      ) : null}

      <Field label="Hedefin adı" value={name} onChangeText={setName} placeholder="Örn: Yaz tatili" maxLength={60} error={errors.name} />
      <Field
        label="Hedef tutar"
        value={targetText}
        onChangeText={setTargetText}
        placeholder="Örn: 40.000"
        keyboardType="decimal-pad"
        error={errors.target}
      />
      <Field
        label="Şu ana kadar biriktirdiğin (isteğe bağlı)"
        value={initialText}
        onChangeText={setInitialText}
        placeholder="0"
        keyboardType="decimal-pad"
        error={errors.initial}
        hint="Uygulamadan önce ayırdığın para varsa buraya yaz."
      />

      <Text style={styles.label}>Hedef tarihi (isteğe bağlı)</Text>
      <View style={styles.chips}>
        <Chip label="Yok" selected={!dateText} onPress={() => setDateText('')} color={colors.text} />
        {DATE_PRESETS.map(([months, label]) => {
          const value = toDisplayDate(presetDate(months));
          return <Chip key={months} label={label} selected={dateText === value} onPress={() => setDateText(value)} color={colors.text} />;
        })}
      </View>
      <Field value={dateText} onChangeText={setDateText} placeholder="GG.AA.YYYY" keyboardType="numbers-and-punctuation" error={errors.date} />

      <Text style={styles.label}>Simge</Text>
      <View style={styles.chips}>
        {GOAL_ICONS.map((iconName) => (
          <Pressable
            key={iconName}
            onPress={() => setIcon(iconName)}
            style={[styles.iconChoice, icon === iconName && { borderColor: color, backgroundColor: `${color}1f` }]}
            accessibilityLabel={iconName}
          >
            <Icon name={iconName} size={22} color={icon === iconName ? color : colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Renk</Text>
      <View style={styles.chips}>
        {PALETTE.map((value) => (
          <Pressable
            key={value}
            onPress={() => setColor(value)}
            style={[styles.colorChoice, { backgroundColor: value }, color === value && styles.colorChosen]}
            accessibilityLabel={`Renk ${value}`}
          />
        ))}
      </View>

      {editing ? (
        <Card style={{ marginTop: spacing.xl }}>
          <SectionHeader title={`Katkılar (${contributions.length})`} />
          {contributions.length ? (
            contributions.map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                lookups={data}
                currency={data.currency}
                showDate
                onPress={() => push('transaction', { transaction: tx })}
              />
            ))
          ) : (
            <Text style={font.small}>Henüz bu hedefe para eklemedin.</Text>
          )}
        </Card>
      ) : null}
    </SheetLayout>
  );
}

const styles = StyleSheet.create({
  progressCard: { marginBottom: spacing.xl },
  progressTop: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  progressSaved: { fontSize: 24, fontWeight: '800', color: colors.text },
  progressTarget: { fontSize: 15, color: colors.textMuted },
  label: { ...font.label, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  iconChoice: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  colorChoice: { width: 32, height: 32, borderRadius: 16 },
  colorChosen: { borderWidth: 3, borderColor: colors.text },
});
