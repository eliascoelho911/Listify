/**
 * SwipeToDelete Molecule Component
 *
 * Swipeable container that reveals delete action when swiped left.
 * Uses react-native-gesture-handler and react-native-reanimated for smooth animations.
 */

import { Trash2 } from 'lucide-react-native';
import React, { useCallback, type ReactElement } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '../../atoms';
import { useTheme } from '../../theme';
import { createSwipeToDeleteStyles } from './SwipeToDelete.styles';
import type { SwipeToDeleteProps } from './SwipeToDelete.types';

const DELETE_ACTION_WIDTH = 80;
const SCREEN_WIDTH = Dimensions.get('window').width;

export function SwipeToDelete({
  children,
  onDelete,
  enabled = true,
  threshold = 0.3,
  deleteLabel = 'Delete',
  testID,
  ...viewProps
}: SwipeToDeleteProps): ReactElement {
  const { theme } = useTheme();
  const styles = createSwipeToDeleteStyles(theme);

  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const isDeleting = useSharedValue(false);

  const triggerDelete = useCallback(() => {
    onDelete();
  }, [onDelete]);

  const panGesture = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX([-10, 10])
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const newValue = startX.value + event.translationX;
      // Only allow swiping left (negative values)
      translateX.value = Math.min(0, Math.max(newValue, -SCREEN_WIDTH * 0.5));
    })
    .onEnd((event) => {
      const velocityThreshold = -500;
      const distanceThreshold = -DELETE_ACTION_WIDTH * 2;

      // Check if swipe was fast enough or far enough
      if (event.velocityX < velocityThreshold || translateX.value < distanceThreshold) {
        // Trigger delete animation
        isDeleting.value = true;
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 }, (finished) => {
          if (finished) {
            runOnJS(triggerDelete)();
          }
        });
      } else if (translateX.value < -DELETE_ACTION_WIDTH * threshold) {
        // Snap to reveal delete action
        translateX.value = withSpring(-DELETE_ACTION_WIDTH, {
          damping: 20,
          stiffness: 300,
        });
      } else {
        // Snap back to closed
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
      }
    });

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedActionStyle = useAnimatedStyle(() => ({
    width: Math.abs(Math.min(translateX.value, -DELETE_ACTION_WIDTH)),
    opacity: Math.min(1, Math.abs(translateX.value) / DELETE_ACTION_WIDTH),
  }));

  return (
    <View style={styles.container} testID={testID} {...viewProps}>
      {/* Delete action background */}
      <Animated.View style={[styles.deleteActionContainer, animatedActionStyle]}>
        <Trash2
          size={20}
          color={theme.colors.destructiveForeground}
          style={styles.deleteIcon}
        />
        <Text style={styles.deleteActionText}>{deleteLabel}</Text>
      </Animated.View>

      {/* Swipeable content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.contentContainer, animatedContentStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
