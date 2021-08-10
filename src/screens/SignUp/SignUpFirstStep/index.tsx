import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native';
import * as Yup from 'yup';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

import {
  Container,
  Header,
  Steps,
  Title,
  SubTitle,
  Form,
  FormTitle
} from './styles';

export function SignUpFirstStep() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  function handleBack() {
    navigation.goBack();
  }

  async function handleNextStep() {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string().required('E-mail é obrigatório').email('Informe um e-mail válido'),
        driverLicense: Yup.string().required('CNH é obrigatório'),
      })

      const data = { name, email, driverLicense }
      await schema.validate(data);

      navigation.navigate('SignUpSecondStep', { user: data });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Opa!', error.message)
      } else {
        Alert.alert('Ocorreu um erro ao criar conta', 'Por favor verifique os dadaos')
        console.log(error)
      }
    }
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
            <FormTitle>1. Dados</FormTitle>
            <Input
              iconName="user"
              placeholder="Nome"
              onChangeText={setName}
              value={name}
            />
            <Input
              iconName="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />
            <Input
              iconName="credit-card"
              placeholder="CNH"
              keyboardType="numeric"
              onChangeText={setDriverLicense}
              value={driverLicense}
            />
          </Form>

          <Button title="próximo" onPress={handleNextStep} />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}