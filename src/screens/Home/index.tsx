import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar, StyleSheet, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync'

import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';
import { CarDTO } from '../../dtos/CarDTO';
import api from '../../services/api';
import Logo from '../../assets/logo.svg';
import { database } from '../../database';
import { Car as ModelCar } from '../../database/models/Car'

import {
  Container,
  Header,
  HeaderContent,
  TotalCars,
  CarList,
} from './styles';
import { Button } from '../../components/Button';


export function Home() {
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<ModelCar[]>([]);

  // const positionY = useSharedValue(0);
  // const positionX = useSharedValue(0);

  // const myCarsButtonStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       { translateX: positionX.value },
  //       { translateY: positionY.value }
  //     ]
  //   }
  // })

  // const onGestureEvent = useAnimatedGestureHandler({
  //   onStart(_, ctx: any) {
  //     ctx.positionX = positionX.value;
  //     ctx.positionY = positionY.value;
  //   },
  //   onActive(event, ctx: any) {
  //     positionX.value = ctx.positionX + event.translationX;
  //     positionY.value = ctx.positionY + event.translationY;
  //   },
  //   onEnd() {
  //     positionX.value = withSpring(0);
  //     positionY.value = withSpring(0);
  //   }
  // });

  async function offlineSynchronize() {
    console.log('------ Off-line sync ----------------')
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const response = await api.get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`)
        const { changes, latestVersion } = response.data;
        return { changes, timestamp: latestVersion }
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        await api.post(`/users/sync`, user)
      }
    });
  }

  useEffect(() => {
    let isMounted = true;

    async function loadCars() {
      try {
        // database.write(async () => {
        //   await database.unsafeResetDatabase()
        // })
        const carCollection = database.get<ModelCar>('cars');
        const cars = await carCollection.query().fetch()

        if (isMounted) {
          setCars(cars);
        }
      } catch (error) {
        console.log('error', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadCars();

    return () => {
      isMounted = false;
    }
  }, [])

  useEffect(() => {
    if (netInfo.isConnected === true) {
      offlineSynchronize()
    }
  }, [netInfo.isConnected])

  function handleCarDetails(car: ModelCar) {
    navigation.navigate('CarDetails', { car })
  }

  function handleOpenMyCars() {
    navigation.navigate('MyCars')
  }

  // async function handleSync() {
  //   console.log('sync')
  //   await offlineSynchronize();
  // }

  // async function handleGetLocalCars() {
  //   const carCollection = database.get<ModelCar>('cars');
  //   const cars = await carCollection.query().fetch()
  //   console.log('cars', cars)
  // }

  // async function handleClearLocalDb() {
  //   console.log('Clear DB')
  //   database.write(async () => {
  //     await database.unsafeResetDatabase()
  //   })
  // }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          {!loading && <TotalCars>Total de {cars.length} carros</TotalCars>}
        </HeaderContent>
      </Header>

      {/* <Button title="Sync" onPress={handleSync} />
      <Button title="Get Local Cars" onPress={handleGetLocalCars} />
      <Button title="Clear Local DB" onPress={handleClearLocalDb} /> */}

      {loading ? <LoadAnimation /> :
        <CarList
          data={cars}
          renderItem={({ item }) =>
            <Car
              data={item}
              onPress={() => handleCarDetails(item)}
            />}
          keyExtractor={item => item.id}
        />}

      {/* <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[myCarsButtonStyle, {
          position: 'absolute',
          bottom: 13,
          right: 22
        }]}>
          <ButtonAnimated
            onPress={handleOpenMyCars}
            style={[styles.button, {
              backgroundColor: theme.colors.main
            }
            ]}
          >
            <Ionicons name="ios-car-sport" size={32} color={theme.colors.shape} />
          </ButtonAnimated>
        </Animated.View>
      </PanGestureHandler> */}
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
})