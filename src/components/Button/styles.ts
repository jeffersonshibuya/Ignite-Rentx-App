import styled from 'styled-components/native';
import { RectButton, RectButtonProperties } from 'react-native-gesture-handler'
import { RFValue } from 'react-native-responsive-fontsize';

interface ButtonProps extends RectButtonProperties {
  color?: string;
  enabled: boolean;
  loading: boolean;
}

export const Container = styled(RectButton) <ButtonProps>`
  width: 100%;
  background-color: ${({ color }) => color};
  opacity: ${({ enabled, loading }) => enabled && !loading ? 1 : 0.5};

  padding: 19px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.primary_500};
  color: ${({ theme }) => theme.colors.shape};
  font-size: ${RFValue(15)}px;
`;