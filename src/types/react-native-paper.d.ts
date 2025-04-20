declare module 'react-native-paper' {
  import { ComponentType } from 'react';
  import { ViewProps, TextProps, StyleProp, ViewStyle, TextStyle } from 'react-native';

  export interface PaperProps {
    style?: StyleProp<ViewStyle>;
    theme?: any;
  }

  export interface CardProps extends PaperProps {
    children?: React.ReactNode;
    onPress?: () => void;
  }

  export interface CardContentProps extends PaperProps {
    children?: React.ReactNode;
  }

  export interface TitleProps extends TextProps {
    children?: React.ReactNode;
  }

  export interface ParagraphProps extends TextProps {
    children?: React.ReactNode;
  }

  export interface SearchbarProps extends PaperProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
  }

  export interface ListProps extends PaperProps {
    children?: React.ReactNode;
  }

  export interface ListSectionProps extends PaperProps {
    children?: React.ReactNode;
  }

  export interface ListItemProps extends PaperProps {
    title?: string;
    description?: string;
    left?: (props: { color: string; style: StyleProp<ViewStyle> }) => React.ReactNode;
    onPress?: () => void;
  }

  export interface ListIconProps extends PaperProps {
    icon: string;
    color?: string;
  }

  export const Card: ComponentType<CardProps>;
  export const CardContent: ComponentType<CardContentProps>;
  export const Title: ComponentType<TitleProps>;
  export const Paragraph: ComponentType<ParagraphProps>;
  export const Searchbar: ComponentType<SearchbarProps>;
  export const List: ComponentType<ListProps>;
  export const ListSection: ComponentType<ListSectionProps>;
  export const ListItem: ComponentType<ListItemProps>;
  export const ListIcon: ComponentType<ListIconProps>;
  export const Provider: ComponentType<{ children: React.ReactNode }>;
} 