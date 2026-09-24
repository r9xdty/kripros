import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SheetLayout from '../components/SheetLayout';
import Icon from '../components/Icon';
import { Button, Card, EmptyState, Field, IconButton, IconCircle, Segmented } from '../components/ui';
import { useData } from '../state/DataContext';
import { CATEGORY_ICONS, KINDS, PALETTE } from '../domain/constants';
import { confirm } from '../lib/dialogs';
import { colors, font, spacing } from '../theme';

const emptyForm = () => ({ id: null, name: '', icon: 'ellipsis-horizontal', color: PALETTE[0] });

export default function CategoriesSheet({ kind: initialKind = 'spending' }) {
  const data = useData();
  const [kind, setKind] = useState(initialKind === 'income' ? 'income' : 'spending');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const categories = data.categories.filter((c) => c.kind === kind);

  const save = () => {
    const name = form.name.trim();
    if (!name) return setError('Bir ad yaz.');
    if (categories.some((c) => c.id !== form.id && c.name.toLocaleLowerCase('tr') === name.toLocaleLowerCase('tr'))) {
      return setError('Bu adda bir kategori zaten var.');
    }
    const sortOrder = form.id
      ? data.categoriesById[form.id]?.sort_order
      : Math.max(0, ...categories.map((c) => c.sort_order || 0)) + 1;
    data.saveCategory({ ...(form.id ? { id: form.id } : {}), kind, name, icon: form.icon, color: form.color, sort_order: sortOrder });
    setForm(emptyForm());
    setError(null);
    return undefined;
  };

  const remove = async (category) => {
    const used = data.transactions.filter((tx) => tx.category_id === category.id).length;
    const ok = await confirm({
      title: 'Kategoriyi sil',
      message: used
        ? `"${category.name}" silinecek. Bu kategorideki ${used} kayıt "Kategorisiz" olarak görünecek.`
        : `"${category.name}" silinecek.`,
      confirmText: 'Sil',
      destructive: true,
    });
    if (ok) data.deleteCategory(category.id);
  };

  return (
    <SheetLayout title="Kategoriler">
      <Segmented
        value={kind}
        onChange={(value) => {
          setKind(value);
          setForm(emptyForm());
          setError(null);
        }}
        options={['spending', 'income'].map((value) => ({ value, label: KINDS[value].plural, color: KINDS[value].color }))}
        style={{ marginBottom: spacing.lg }}
      />

      <Card style={{ marginBottom: spacing.xl }}>
        <Text style={[font.heading, { marginBottom: spacing.md }]}>{form.id ? 'Kategoriyi düzenle' : 'Yeni kategori'}</Text>
        <Field label="Ad" value={form.name} onChangeText={(name) => setForm({ ...form, name })} placeholder="Örn: Kahve" maxLength={40} />
        <Text style={styles.label}>Simge</Text>
        <View style={styles.grid}>
          {CATEGORY_ICONS.map((icon) => (
            <Pressable
              key={icon}
              onPress={() => setForm({ ...form, icon })}
              style={[styles.iconChoice, form.icon === icon && { borderColor: form.color, backgroundColor: `${form.color}1f` }]}
              accessibilityLabel={icon}
            >
              <Icon name={icon} size={20} color={form.icon === icon ? form.color : colors.textMuted} />
            </Pressable>
          ))}
        </View>
        <Text style={[styles.label, { marginTop: spacing.md }]}>Renk</Text>
        <View style={styles.grid}>
          {PALETTE.map((color) => (
            <Pressable
              key={color}
              onPress={() => setForm({ ...form, color })}
              style={[styles.colorChoice, { backgroundColor: color }, form.color === color && styles.colorChosen]}
              accessibilityLabel={`Renk ${color}`}
            />
          ))}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.formActions}>
          {form.id ? <Button title="Vazgeç" variant="secondary" onPress={() => setForm(emptyForm())} style={{ flex: 1 }} /> : null}
          <Button title={form.id ? 'Güncelle' : 'Ekle'} icon="checkmark" onPress={save} style={{ flex: 1 }} color={KINDS[kind].color} />
        </View>
      </Card>

      {categories.length ? (
        <Card>
          {categories.map((category) => (
            <View key={category.id} style={styles.row}>
              <IconCircle icon={category.icon} color={category.color} size={36} />
              <Text style={styles.name}>{category.name}</Text>
              <IconButton
                icon="create-outline"
                color={colors.textMuted}
                label="Düzenle"
                onPress={() => setForm({ id: category.id, name: category.name, icon: category.icon, color: category.color })}
              />
              <IconButton icon="trash-outline" color={colors.danger} label="Sil" onPress={() => remove(category)} />
            </View>
          ))}
        </Card>
      ) : (
        <EmptyState icon="pricetags" title="Kategori yok" message="Yukarıdan yeni bir kategori ekleyebilirsin." />
      )}
    </SheetLayout>
  );
}

const styles = StyleSheet.create({
  label: { ...font.label, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  iconChoice: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  colorChoice: { width: 30, height: 30, borderRadius: 15 },
  colorChosen: { borderWidth: 3, borderColor: colors.text },
  error: { color: colors.danger, marginTop: spacing.md },
  formActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  name: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
});
