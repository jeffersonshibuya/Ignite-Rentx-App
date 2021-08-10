import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons'
import * as Yup from 'yup';

import { Input } from '../../components/Input';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { InputPassword } from '../../components/InputPassword';
import { useAuth } from '../../hooks/auth';
import { Button } from '../../components/Button';

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section
} from './styles';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { useNetInfo } from '@react-native-community/netinfo';

export function Profile() {

  const { user, signOut, updateUser } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);


  function handleBack() {
    navigation.goBack();
  }

  function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit') {
    if (netInfo.isConnected === false && optionSelected === 'passwordEdit') {
      Alert.alert('Você está offline', 'Para mudar a senha, conecte-se a Internet')
    } else {
      setOption(optionSelected);
    }
  }

  async function handleSelectAvatar() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    })

    if (result.cancelled) {
      return;
    }

    const { uri } = result as ImageInfo

    setAvatar(uri);
  }

  async function handleProfileUpdate() {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        driverLicense: Yup.string().required('CNH é obrigatória'),
      })

      const data = { name, driverLicense }
      schema.validate(data);

      await updateUser({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        avatar,
        name,
        driver_license: driverLicense,
        token: user.token
      });

      Alert.alert('Perfil atualizado!')
    } catch (error) {
      console.log(error)
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Opa!', error.message)
      } else {
        Alert.alert('Opa!', 'Não foi possível atualizar o perfil')
      }
    }
  }

  async function handleSignOut() {
    Alert.alert(
      'Tem certeza?',
      'Se você sair, irá precisar de internet para conectar-se novamente',
      [
        {
          text: 'Cancelar',
          onPress: () => { },
        },
        {
          text: "Sair",
          onPress: () => signOut()
        }
      ]
    )
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton color={theme.colors.shape} onPress={handleBack} />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
                <Feather name="power" size={24} color={theme.colors.shape} />
              </LogoutButton>
            </HeaderTop>
            <PhotoContainer>
              {!!avatar && <Photo source={{ uri: avatar }} />}
              <PhotoButton onPress={handleSelectAvatar}>
                <Feather name="camera" size={24} color={theme.colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </Header>

          <Content style={{
            marginBottom: useBottomTabBarHeight()
          }}>
            <Options>
              <Option active={option === 'dataEdit'} onPress={() => handleOptionChange('dataEdit')}>
                <OptionTitle active={option === 'dataEdit'}>Dados</OptionTitle>
              </Option>
              <Option active={option === 'passwordEdit'} onPress={() => handleOptionChange('passwordEdit')}>
                <OptionTitle active={option === 'passwordEdit'}>Trocar senha</OptionTitle>
              </Option>
            </Options>

            {option === 'dataEdit'
              ?
              <Section>
                <Input
                  iconName="user"
                  placeholder="Nome"
                  autoCorrect={false}
                  defaultValue={user.name}
                  onChangeText={setName}
                />
                <Input
                  iconName="mail"
                  editable={false}
                  autoCorrect={false}
                  defaultValue={user.email}
                />
                <Input
                  iconName="credit-card"
                  placeholder="CNH"
                  keyboardType="numeric"
                  defaultValue={user.driver_license}
                  onChangeText={setDriverLicense}
                />
              </Section>

              : <Section>
                <InputPassword
                  iconName="lock"
                  placeholder="Senha atual"
                />
                <InputPassword
                  iconName="lock"
                  placeholder="Nova Senha"
                />
                <InputPassword
                  iconName="lock"
                  placeholder="Confirmar Nova Senha"
                />
              </Section>
            }
            <Button title="Salvar alterações" onPress={handleProfileUpdate} />
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}