import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components'

import {
  Container,
  Title
} from './styles';

interface Props extends RectButtonProperties {
  title: string;
  color?: string;
  loading?: boolean;
  light?: boolean;
}

export function Button({
  title,
  color,
  enabled = true,
  loading = false,
  light = false,
  ...rest
}: Props) {

  const theme = useTheme();

  return (
    <Container
      color={color ? color : theme.colors.main}
      enabled={enabled}
      loading={loading}
      {...rest}
    >
      {loading ? <ActivityIndicator color={theme.colors.shape} size={24} />
        : <Title light={light}>{title}</Title>}
    </Container>
  );
}