declare module './src/screens/CityDetailScreen' {
  import { ComponentType } from 'react';
  import { NativeStackScreenProps } from '@react-navigation/native-stack';
  import { RootStackParamList } from './src/types';

  type CityDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'CityDetail'>;

  const CityDetailScreen: ComponentType<CityDetailScreenProps>;
  export default CityDetailScreen;
} 