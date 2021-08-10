import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated'

import BrandSvg from '../../assets/brand.svg'
// import LogoSvg from '../../assets/logo.svg'
import LogoWithoutBrandSvg from '../../assets/logo_without_brand.svg'

import {
  Container
} from './styles';

export function Splash() {

  const navigation = useNavigation();

  const splashAnimation = useSharedValue(0);

  const brandStyle = useAnimatedStyle(() => {
    return {
      // opacity: interpolate(splashAnimation.value, [0, 50], [1, 0]),
      transform: [
        {
          translateX: interpolate(splashAnimation.value,
            [0, 50],
            [0, 75],
            Extrapolate.CLAMP
          ),

        },
        {
          scale: interpolate(splashAnimation.value, [0, 50], [1, 0.4])
        },
      ],
    }
  })

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value,
        [0, 25, 35, 45, 50],
        [0, .3, .4, .6, 1],
      ),
      // transform: [
      //   {
      //     translateX: interpolate(splashAnimation.value,
      //       [0, 50],
      //       [-50, 0],
      //       Extrapolate.CLAMP
      //     )
      //   }
      // ]
    }
  })

  function startApp() {
    navigation.navigate('SignIn')
  }

  useEffect(() => {
    splashAnimation.value = withTiming(
      50,
      { duration: 2000 },
      () => {
        'worklet'
        runOnJS(startApp)();
      })
  }, [])

  return (
    <Container>
      <Animated.View style={[brandStyle, { position: 'absolute' }]}>
        <BrandSvg width={80} height={50} />
      </Animated.View>

      <Animated.View style={[logoStyle, { marginRight: 40 }]}>
        <LogoWithoutBrandSvg width={180} height={20} />
      </Animated.View>
    </Container>
  );
}
