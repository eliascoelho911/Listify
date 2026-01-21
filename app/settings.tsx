/**
 * Settings Route
 *
 * Route for the settings screen accessible from profile button
 */

import type { ReactElement } from 'react';

import { SettingsScreen } from '@presentation/screens/SettingsScreen';

export default function SettingsRoute(): ReactElement {
  return <SettingsScreen />;
}
