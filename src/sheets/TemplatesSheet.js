import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SheetLayout from '../components/SheetLayout';
import { Button, Card, EmptyState, Field, IconButton, IconCircle, Segmented } from '../components/ui';
import { useData } from '../state/DataContext';
import { FREQUENCIES } from '../domain/constants';
import { amountToInput, formatMoney, parseAmount } from '../lib/money';
import { confirm } from '../lib/dialogs';
import { colors, font, spacing } from '../theme';

const EMPTY = { id: null, name: '', amount: '', frequency: 'daily' };

export default function TemplatesSheet() {
  const data = useData();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);

  const save = () => {
    const amount = parseAmount(form.amount);
    if (!form.name.trim()) return setError('Bir ad yaz.');
    if (!(amount > 0)) return setError('Geçerli bir tutar gir.');
    data.saveTemplate({ ...(form.id ? { id: form.id } : {}), name: form.name, amount, frequency: form.frequency });
    setForm(EMPTY);
    setError(null);
    return undefined;
  };

  const remove = async (template) => {
    const ok = await confirm({
      title: 'Alışkanlığı sil',
      message: `"${template.name}" silinecek. Daha önce eklediğin kayıtlar geçmişte kalır.`,
      confirmText: 'Sil',
      destructive: true,
    });
    if (ok) data.deleteTemplate(template.id);
  };

  return (
    <SheetLayout title="Birikim alışkanlıkları">
      <Text style={styles.intro}>
        Sık yaptığın tasarrufları kaydet (örn. “Kahve almadım · 85 ₺ · günlük”). Takvimde ve ana sayfada tek dokunuşla
        eklersin; zamanı gelenler öneri olarak çıkar.
      </Text>

      <Card style={{ marginBottom: spacing.xl }}>
        <Text style={[font.heading, { marginBottom: spacing.md }]}>{form.id ? 'Alışkanlığı düzenle' : 'Yeni alışkanlık'}</Text>
        <Field label="Ad" value={form.name} onChangeText={(name) => setForm({ ...form, name })} placeholder="Örn: Kahve almadım" maxLength={60} />
        <Field
          label="Tutar"
          value={form.amount}
          onChangeText={(amount) => setForm({ ...form, amount })}
          placeholder="Örn: 85"
          keyboardType="decimal-pad"
        />
        <Text style={styles.label}>Ne sıklıkla?</Text>
        <Segmented
          value={form.frequency}
          onChange={(frequency) => setForm({ ...form, frequency })}
          options={Object.entries(FREQUENCIES).map(([value, f]) => ({ value, label: f.label }))}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.formActions}>
          {form.id ? (
            <Button title="Vazgeç" variant="secondary" onPress={() => setForm(EMPTY)} style={{ flex: 1 }} />
          ) : null}
          <Button title={form.id ? 'Güncelle' : 'Ekle'} icon="checkmark" onPress={save} style={{ flex: 1 }} />
        </View>
      </Card>

      {data.templates.length ? (
        <Card>
          {data.templates.map((template) => (
            <View key={template.id} style={styles.row}>
              <IconCircle icon="leaf" color={colors.saving} size={36} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{template.name}</Text>
                <Text style={font.small}>
                  {formatMoney(template.amount, data.currency, { whole: true })} · {FREQUENCIES[template.frequency]?.label}
                </Text>
              </View>
              <IconButton
                icon="create-outline"
                color={colors.textMuted}
                label="Düzenle"
                onPress={() =>
                  setForm({ id: template.id, name: template.name, amount: amountToInput(template.amount), frequency: template.frequency })
                }
              />
              <IconButton icon="trash-outline" color={colors.danger} label="Sil" onPress={() => remove(template)} />
            </View>
          ))}
        </Card>
      ) : (
        <EmptyState icon="leaf" title="Henüz alışkanlık yok" message="Yukarıdan ilk birikim alışkanlığını ekle." />
      )}
    </SheetLayout>
  );
}

const styles = StyleSheet.create({
  intro: { ...font.small, fontSize: 14, lineHeight: 20, marginBottom: spacing.lg },
  label: { ...font.label, marginBottom: spacing.sm },
  error: { color: colors.danger, marginTop: spacing.md },
  formActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
});
