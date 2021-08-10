import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useTheme } from 'styled-components';
import * as Yup from 'yup';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { InputPassword } from '../../components/InputPassword';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Form,
  Footer
} from './styles';

export function SignIn() {

  const theme = useTheme();
  const navigation = useNavigation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string()
          .required('Senha é obrigatório')
      })

      await schema.validate({ email, password });

      await signIn({ email, password })

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Opa!', error.message)
      } else {
        Alert.alert('Erro na autenticação', 'Verifique as credenciais')
        console.log(error)
      }
    }
  }

  function handleNewAccount() {
    navigation.navigate('SignUpFirstStep');
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="dark-content"
            translucent
            backgroundColor="transparent"
          />
          <Header>
            <Title>
              Estamos {'\n'}
              quase lá.
            </Title>
            <SubTitle>
              Faça seu login para começar {'\n'}
              uma experiência incrível
            </SubTitle>
          </Header>

          <Form>
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />
            <InputPassword
              iconName="lock"
              placeholder="Senha"
              autoCapitalize="none"
              onChangeText={setPassword}
              value={password}
            />
          </Form>

          <Footer>
            <Button
              title="Login"
              onPress={handleSignIn}
              enabled={true}
              loading={false}
              style={{ marginBottom: 8 }}
            />
            <Button
              title="Criar conta gratuita"
              onPress={handleNewAccount}
              enabled={true}
              loading={false}
              color={theme.colors.background_secondary}
              light
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}