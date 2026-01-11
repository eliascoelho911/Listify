import { ReactElement } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import StorybookUIRoot from '../../.rnstorybook/index';

export default function StoryBook(): ReactElement {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StorybookUIRoot />
    </SafeAreaView>
  );
}
