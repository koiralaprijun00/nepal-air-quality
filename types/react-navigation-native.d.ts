declare module '@react-navigation/native' {
  import { ComponentType } from 'react';
  import { ViewProps, StyleProp, ViewStyle } from 'react-native';

  export interface NavigationContainerProps {
    children: React.ReactNode;
    theme?: any;
    linking?: any;
    fallback?: React.ReactNode;
    onReady?: () => void;
    onStateChange?: (state: any) => void;
  }

  export interface NavigationProp<ParamList extends {}> {
    navigate: <RouteName extends keyof ParamList>(
      ...args: ParamList[RouteName] extends undefined
        ? [RouteName]
        : [RouteName, ParamList[RouteName]]
    ) => void;
    goBack: () => void;
    setParams: (params: Partial<ParamList[keyof ParamList]>) => void;
    addListener: (type: string, callback: () => void) => () => void;
    isFocused: () => boolean;
  }

  export const NavigationContainer: ComponentType<NavigationContainerProps>;
  export const useNavigation: <T = any>() => NavigationProp<T>;
  export const useRoute: <T = any>() => { params: T };
  export const DefaultTheme: any;
  export const DarkTheme: any;
} 