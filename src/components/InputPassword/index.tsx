import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons'
import { useTheme } from 'styled-components';
import { TextInputProps } from 'react-native';

import {
  Container,
  IconContainer,
  InputText,
} from './styles';
import { BorderlessButton } from 'react-native-gesture-handler';

interface Props extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
  value?: string;
}

export function InputPassword({ iconName, value, ...rest }: Props) {

  const theme = useTheme();

  const [isPasswordVisible, setIsPasswordVisible] = useState(true)

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  function handleInputFocused() {
    setIsFocused(true);
  }

  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!value);
  }


  function handleTogglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  return (
    <Container>
      <IconContainer isFocused={false}>
        <Feather
          name={iconName}
          size={24}
          color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
        />
      </IconContainer>

      <InputText
        {...rest}
        onFocus={handleInputFocused}
        onBlur={handleInputBlur}
        secureTextEntry={isPasswordVisible}
        autoCorrect={false}
        isFocused={isFocused}
      />

      <BorderlessButton onPress={handleTogglePasswordVisibility}>
        <IconContainer isFocused={isFocused}>
          <Feather
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={24}
            color={theme.colors.text_detail}
          />
        </IconContainer>
      </BorderlessButton>
    </Container>
  );
}