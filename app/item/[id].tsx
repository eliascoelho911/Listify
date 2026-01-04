import type { ReactElement } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';

import EditItemScreen from '@presentation/screens/EditItemScreen';

export default function EditItemRoute(): ReactElement {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: 'Editar Item' }} />
      <EditItemScreen itemId={id} />
    </>
  );
}
