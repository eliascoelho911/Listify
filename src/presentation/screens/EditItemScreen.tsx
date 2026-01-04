import type { ReactElement } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

type EditItemScreenProps = {
  itemId?: string;
};

export default function EditItemScreen({ itemId }: EditItemScreenProps): ReactElement {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Editar item</Text>
        <Text style={styles.subtitle}>ID selecionado: {itemId ?? 'não informado'}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
  },
});
