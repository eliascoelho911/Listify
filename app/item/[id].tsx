import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, useLocalSearchParams } from 'expo-router';

import EditItemScreen from '@presentation/screens/EditItemScreen';

export default function EditItemRoute(): ReactElement {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: t('navigation.editItemTitle') }} />
      <EditItemScreen itemId={id} />
    </>
  );
}
