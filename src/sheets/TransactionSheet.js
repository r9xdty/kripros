import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import SheetLayout from '../components/SheetLayout';
import DateField from '../components/DateField';
import { Button, Chip, Field, IconButton, Segmented } from '../components/ui';
import { useData } from '../state/DataContext';
import { validateTransaction } from '../domain/transactions';
import { budgetAlert, budgetStatus } from '../domain/budgets';
import { useSheets } from '../navigation/sheets';
import { useToast } from '../components/Toast';
import { KINDS, KIND_ORDER } from '../domain/constants';
import { amountToInput, currencySymbol, formatMoney, parseAmount } from '../lib/money';
import { fromDateKey, todayKey } from '../lib/dates';
import { confirm } from '../lib/dialogs';
import { colors, font, radius, spacing } from '../theme';

// Warning to show when a spending pushes this month's budget of its category
// past 80% or 100%.
const budgetWarning = (values, previous, { categoriesById, transactions }) => {
  const category = values.kind === 'spending' && categoriesById[values.category_id];
  const now = new Date();
  if (!category || !(category.monthly_budget > 0) || !values.occurred_on.startsWith(todayKey(now).slice(0, 7))) return null;
  const day = fromDateKey(values.occurred_on);
  const status = (list) => budgetStatus([category], list, day.getFullYear(), day.getMonth())[0];
  const others = previous ? transactions.filter((tx) => tx.id !== previous.id) : transactions;
  return budgetAlert(status(transactions), status([...others, values]));
};

const PLACEHOLDERS = {
  spending: 'Örn: Migros, kira, fatura',
  income: 'Örn: Eylül maaşı',
  saving: 'Örn: Kahve almadım',
};

export default function TransactionSheet({ transaction, kind: initialKind, date, goalId, templateId }) {
  const data = useData();
  const { pop, push } = useSheets();
  const toast = useToast();
  const editing = Boolean(transaction);
  const initialTemplate = templateId ? data.templatesById[templateId] : null;

  const [kind, setKind] = useState(transaction?.kind || initialKind || 'spending');
  const [amountText, setAmountText] = useState(
    transaction ? amountToInput(transaction.amount) : initialTemplate ? amountToInput(initialTemplate.amount) : '',
  );
  const [title, setTitle] = useState(transaction?.title || initialTemplate?.name || '');
  const [categoryId, setCategoryId] = useState(transaction?.category_id || null);
  const [selectedTemplate, setSelectedTemplate] = useState(transaction?.template_id || templateId || null);
  const [selectedGoal, setSelectedGoal] = useState(transaction?.goal_id || goalId || null);
  const [occurredOn, setOccurredOn] = useState(transaction?.occurred_on || date || todayKey());
  const [note, setNote] = useState(transaction?.note || '');
  const [error, setError] = useState(null);

  const categories = useMemo(() => data.categories.filter((c) => c.kind === kind), [data.categories, kind]);
  const color = KINDS[kind].color;

  const pickTemplate = (template) => {
    if (selectedTemplate === template.id) {
      setSelectedTemplate(null);
      return;
    }
    setSelectedTemplate(template.id);
    setTitle(template.name);
    setAmountText(amountToInput(template.amount));
  };

  const save = () => {
    const values = {
      ...(transaction ? { id: transaction.id } : {}),
      kind,
      amount: parseAmount(amountText),
      title,
      note,
      occurred_on: occurredOn,
      category_id: categoryId && data.categoriesById[categoryId]?.kind === kind ? categoryId : null,
      template_id: selectedTemplate,
      goal_id: selectedGoal,
    };
    const problem = validateTransaction(values);
    if (problem) {
      setError(problem);
      return;
    }
    const warning = budgetWarning(values, transaction, data);
    data.saveTransaction(values);
    if (warning) toast(warning, { icon: 'warning' });
    else toast(editing ? 'Kayıt güncellendi' : `${KINDS[kind].label} eklendi`);
    pop();
  };

  const remove = async () => {
    const ok = await confirm({
      title: 'Kaydı sil',
      message: 'Bu kayıt kalıcı olarak silinecek.',
      confirmText: 'Sil',
      destructive: true,
    });
    if (!ok) return;
    data.deleteTransaction(transaction.id);
    toast('Kayıt silindi', { icon: 'trash' });
    pop();
  };

  return (
    <SheetLayout
      title={editing ? 'Kaydı düzenle' : 'Yeni kayıt'}
      right={editing ? <IconButton icon="trash-outline" color={colors.danger} onPress={remove} label="Sil" /> : null}
      footer={<Button title={editing ? 'Değişiklikleri kaydet' : 'Kaydet'} color={color} onPress={save} icon="checkmark" />}
    >
      <Segmented
        value={kind}
        onChange={(value) => {
          setKind(value);
          setError(null);
        }}
        options={KIND_ORDER.map((value) => ({ value, label: KINDS[value].label, color: KINDS[value].color }))}
      />

      <View style={[styles.amountBox, { borderColor: color }]}>
        <TextInput
          value={amountText}
          onChangeText={(text) => {
            setAmountText(text);
            setError(null);
          }}
          placeholder="0"
          placeholderTextColor={colors.textFaint}
          keyboardType="decimal-pad"
          autoFocus={!editing && !initialTemplate}
          style={[styles.amountInput, { color }]}
          accessibilityLabel="Tutar"
          maxLength={16}
        />
        <Text style={[styles.currency, { color }]}>{currencySymbol(data.currency)}</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {kind === 'saving' ? (
        <>
          {data.templates.length > 0 ? (
            <View style={styles.group}>
              <Text style={styles.groupLabel}>Birikim alışkanlıkların</Text>
              <View style={styles.chips}>
                {data.templates.map((template) => (
                  <Chip
                    key={template.id}
                    label={`${template.name} · ${formatMoney(template.amount, data.currency, { whole: true })}`}
                    icon="leaf"
                    color={colors.saving}
                    selected={selectedTemplate === template.id}
                    onPress={() => pickTemplate(template)}
                  />
                ))}
              </View>
            </View>
          ) : null}
          {data.goals.length > 0 ? (
            <View style={styles.group}>
              <Text style={styles.groupLabel}>Bir hedefe ekle (isteğe bağlı)</Text>
              <View style={styles.chips}>
                {data.goals.map((goal) => (
                  <Chip
                    key={goal.id}
                    label={goal.name}
                    icon={goal.icon}
                    color={goal.color}
                    selected={selectedGoal === goal.id}
                    onPress={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </>
      ) : (
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Kategori</Text>
          {categories.length ? (
            <View style={styles.chips}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  icon={category.icon}
                  color={category.color}
                  selected={categoryId === category.id}
                  onPress={() => setCategoryId(categoryId === category.id ? null : category.id)}
                />
              ))}
            </View>
          ) : (
            <Button title="Kategori oluştur" variant="secondary" compact icon="add" onPress={() => push('categories', { kind })} />
          )}
        </View>
      )}

      <Field
        label="Açıklama"
        value={title}
        onChangeText={setTitle}
        placeholder={PLACEHOLDERS[kind]}
        maxLength={80}
        returnKeyType="done"
      />
      <DateField value={occurredOn} onChange={setOccurredOn} />
      <Field
        label="Not (isteğe bağlı)"
        value={note}
        onChangeText={setNote}
        placeholder="Eklemek istediğin bir detay"
        multiline
        maxLength={500}
        inputStyle={{ minHeight: 72, textAlignVertical: 'top' }}
      />
    </SheetLayout>
  );
}

const styles = StyleSheet.create({
  amountBox: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
  },
  amountInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: spacing.md,
    // The coloured border already shows focus; hide the browser's outline.
    outlineStyle: 'none',
  },
  currency: { fontSize: 28, fontWeight: '700' },
  error: { color: colors.danger, marginTop: spacing.sm, fontSize: 14, textAlign: 'center' },
  group: { marginTop: spacing.lg, marginBottom: spacing.sm },
  groupLabel: { ...font.label, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
