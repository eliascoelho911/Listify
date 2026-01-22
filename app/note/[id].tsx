/**
 * Dynamic Note Route
 *
 * Displays the NoteDetailScreen for viewing and editing notes.
 * Supports markdown content with view/edit toggle.
 */

import React, { type ReactElement } from 'react';

import { NoteDetailScreen } from '@presentation/screens';

export default function NoteRoute(): ReactElement {
  return <NoteDetailScreen />;
}
