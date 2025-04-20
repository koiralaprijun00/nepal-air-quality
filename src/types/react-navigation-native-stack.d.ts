declare module '@react-navigation/native-stack' {
  import { ComponentType } from 'react';
  import { NavigationProp } from '@react-navigation/native';

  export interface NativeStackNavigationOptions {
    title?: string;
    headerShown?: boolean;
    headerStyle?: {
      backgroundColor?: string;
    };
    headerTintColor?: string;
    headerTitleStyle?: {
      fontWeight?: string;
    };
  }

  export interface NativeStackScreenProps<ParamList extends {}, RouteName extends keyof ParamList = keyof ParamList> {
    navigation: NavigationProp<ParamList>;
    route: {
      key: string;
      name: RouteName;
      params: ParamList[RouteName];
    };
  }

  export interface NativeStackNavigatorProps {
    initialRouteName?: string;
    screenOptions?: NativeStackNavigationOptions;
    children: React.ReactNode;
  }

  export function createNativeStackNavigator<ParamList extends {}>(): {
    Navigator: ComponentType<NativeStackNavigatorProps>;
    Screen: ComponentType<{
      name: keyof ParamList;
      component: ComponentType<any>;
      options?: NativeStackNavigationOptions;
    }>;
  };
} 