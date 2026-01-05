import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ShoppingListScreen(): ReactElement {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('screens.home.title')}</Text>
        <Text style={styles.subtitle}>{t('screens.home.subtitle')}</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('screens.home.cardTitle')}</Text>
          <Text style={styles.cardText}>{t('screens.home.cardText')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  content: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#111827',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cardText: {
    fontSize: 15,
    color: '#4b5563',
  },
});
