import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from 'styled-components';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { InputPassword } from '../../../components/InputPassword';
import api from '../../../services/api';

import {
  Container,
  Header,
  Steps,
  Title,
  SubTitle,
  Form,
  FormTitle
} from './styles';

interface Params {
  user: {
    name: string;
    email: string;
    driverLicense: string;
  }
}

export function SignUpSecondStep() {
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();

  const { user } = route.params as Params

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleBack() {
    navigation.goBack();
  }

  async function handleRegister() {
    if (password !== confirmPassword) {
      Alert.alert('Opa!', 'Senha e Confirmar senha são obrigatórios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Opa!', 'Senha e Confirmar senha devem ser iguais');
      return;
    }

    await api.post('/users', {
      ...user,
      driver_license: user.driverLicense,
      password,
    }).then(() => {
      const confirmationMessage = {
        title: 'Conta criada',
        message: `Agora é só fazer o login \ne aproveitar`,
        nextScreenRoute: 'SignIn'
      }

      navigation.navigate('Confirmation', { ...confirmationMessage })
    }).catch(() => {
      Alert.alert('Opa!', 'Não foi possível cadastrar')
    })


  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack} />
            <Steps>
              <Bullet active={true} />
              <Bullet />
            </Steps>
          </Header>

          <Title>
            Crie sua {'\n'}
            conta
          </Title>
          <SubTitle>
            Faça seu cadastro {'\n'}
            forma rápida e fácil
          </SubTitle>

          <Form>
            <FormTitle>2. Senha</FormTitle>
            <InputPassword
              iconName="lock"
              placeholder="Senha"
              onChangeText={setPassword}
              value={password}
            />
            <InputPassword
              iconName="lock"
              placeholder="Confirmar Senha"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
          </Form>

          <Button
            title="Cadastrar"
            onPress={handleRegister}
            color={theme.colors.success}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}