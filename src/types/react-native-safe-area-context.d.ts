declare module 'react-native-safe-area-context' {
  import { ComponentType } from 'react';
  import { ViewProps, StyleProp, ViewStyle } from 'react-native';

  export interface SafeAreaProviderProps extends ViewProps {
    children: React.ReactNode;
    initialMetrics?: {
      insets: {
        top: number;
        right: number;
        bottom: number;
        left: number;
      };
      frame: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    };
  }

  export interface SafeAreaViewProps extends ViewProps {
    children: React.ReactNode;
    mode?: 'padding' | 'margin';
    edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
  }

  export const SafeAreaProvider: ComponentType<SafeAreaProviderProps>;
  export const SafeAreaView: ComponentType<SafeAreaViewProps>;
  export const useSafeAreaInsets: () => {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
} 