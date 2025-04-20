declare module 'react-native-maps' {
  import { ComponentType } from 'react';
  import { ViewProps, StyleProp, ViewStyle, LatLng } from 'react-native';

  export interface MapViewProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
    initialRegion?: Region;
    region?: Region;
    onRegionChange?: (region: Region) => void;
    onRegionChangeComplete?: (region: Region) => void;
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    showsCompass?: boolean;
    showsScale?: boolean;
    showsTraffic?: boolean;
    showsBuildings?: boolean;
    showsIndoors?: boolean;
    showsIndoorLevelPicker?: boolean;
    showsPointsOfInterest?: boolean;
    showsUserLocation?: boolean;
    followsUserLocation?: boolean;
    userLocationAnnotationTitle?: string;
    userLocationCalloutEnabled?: boolean;
    userLocationPriority?: 'high' | 'balanced' | 'low';
    userLocationUpdateInterval?: number;
    userLocationFastestInterval?: number;
    userLocationSmallestDisplacement?: number;
    userLocationAccuracy?: number;
    userLocationAccuracyRadius?: number;
    userLocationAccuracyColor?: string;
    userLocationAccuracyFillColor?: string;
    userLocationAccuracyStrokeColor?: string;
    userLocationAccuracyStrokeWidth?: number;
    userLocationAccuracyRadius?: number;
    userLocationAccuracyFillColor?: string;
    userLocationAccuracyStrokeColor?: string;
    userLocationAccuracyStrokeWidth?: number;
  }

  export interface MarkerProps extends ViewProps {
    coordinate: LatLng;
    title?: string;
    description?: string;
    image?: any;
    pinColor?: string;
    onPress?: () => void;
    onSelect?: () => void;
    onDeselect?: () => void;
    onCalloutPress?: () => void;
    onDragStart?: () => void;
    onDrag?: () => void;
    onDragEnd?: () => void;
    tracksViewChanges?: boolean;
    tracksInfoWindowChanges?: boolean;
    tracksInfoWindowChanges?: boolean;
  }

  export interface CalloutProps extends ViewProps {
    tooltip?: boolean;
    onPress?: () => void;
  }

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export const MapView: ComponentType<MapViewProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const Callout: ComponentType<CalloutProps>;
  export const PROVIDER_GOOGLE: string;
  export const PROVIDER_DEFAULT: string;
} 