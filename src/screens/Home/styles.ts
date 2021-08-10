import { RFValue } from 'react-native-responsive-fontsize';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Car } from '../../database/models/Car';

export const Container = styled.View`
  flex: 1;

  background: ${({ theme }) => theme.colors.background_primary};
`;

export const Header = styled.View`
  width: 100%;
  height: 115px;

  background-color: ${({ theme }) => theme.colors.header};

  justify-content: flex-end;
  padding: 32px 24px;
`;

export const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TotalCars = styled.Text`
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const CarList = styled(FlatList as new () => FlatList<Car>).attrs({
  contentContainerStyle: {
    padding: 24
  },
  showsVerticalScrollIndicator: false
})``;