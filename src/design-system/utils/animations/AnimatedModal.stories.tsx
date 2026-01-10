/**
 * Animated Modal Example Story
 */

import React, { useState } from 'react';
import { Animated, Modal, Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../atoms/Button/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../atoms/Card/Card';
import { ThemeProvider } from '../../theme';
import { useModalAnimation } from './useModalAnimation';

function AnimatedModalExample() {
  const [visible, setVisible] = useState(false);
  const { opacity, translateY, hide } = useModalAnimation(visible);

  const handleClose = () => {
    hide(() => setVisible(false));
  };

  return (
    <View style={{ padding: 20 }}>
      <Button onPress={() => setVisible(true)}>Open Modal</Button>

      <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.background + '80', // Add 50% opacity
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Animated.View
            style={{
              opacity,
              transform: [{ translateY }],
              width: '100%',
              maxWidth: 400,
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Animated Modal</CardTitle>
              </CardHeader>
              <CardContent>
                <Text>
                  This modal uses useModalAnimation hook with slide + fade effects. Animation
                  respects reduced motion preference.
                </Text>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onPress={handleClose}>
                  Close
                </Button>
              </CardFooter>
            </Card>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const meta: Meta<typeof AnimatedModalExample> = {
  title: 'Utils/Animations/Modal',
  component: AnimatedModalExample,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AnimatedModalExample>;

export const Default: Story = {};
