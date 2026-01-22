/**
 * ColorPicker Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

const COLOR_SWATCH_SIZE = 44;
const SWATCHES_PER_ROW = 5;

export const createColorPickerStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
    },
    swatch: {
      width: COLOR_SWATCH_SIZE,
      height: COLOR_SWATCH_SIZE,
      borderRadius: theme.radii.full,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      // eslint-disable-next-line local-rules/no-hardcoded-values -- transparent is a valid CSS keyword
      borderColor: 'transparent',
    },
    swatchSelected: {
      borderColor: theme.colors.foreground,
      borderWidth: 3,
    },
    swatchInner: {
      width: COLOR_SWATCH_SIZE - 8,
      height: COLOR_SWATCH_SIZE - 8,
      borderRadius: theme.radii.full,
    },
    checkmark: {
      position: 'absolute',
    },
  });
};

export { COLOR_SWATCH_SIZE, SWATCHES_PER_ROW };
