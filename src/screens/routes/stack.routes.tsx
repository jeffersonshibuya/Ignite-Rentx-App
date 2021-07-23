import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { Home } from '../Home';
import { CarDetails } from '../CarDetails';
import { Scheduling } from '../Scheduling';
import { SchedulingDetails } from '../SchedulingDetails';
import { SchedulingComplete } from '../SchedulingComplete';
import { MyCars } from '../MyCars';
import { Splash } from '../Splash';

const { Navigator, Screen } = createStackNavigator();

export function StackRoutes() {
  return (
    <Navigator headerMode="none" initialRouteName="Splash">
      <Screen name="Splash" component={Splash} />
      <Screen name="Home" component={Home} options={{
        gestureEnabled: false
      }} />
      <Screen name="CarDetails" component={CarDetails} />
      <Screen name="Scheduling" component={Scheduling} />
      <Screen name="SchedulingDetails" component={SchedulingDetails} />
      <Screen name="SchedulingComplete" component={SchedulingComplete} />
      <Screen name="MyCars" component={MyCars} />
    </Navigator>
  );
}