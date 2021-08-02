/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import SyncStorage from 'sync-storage';

import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './components/Client/homepage';
import AddCam from './components/Client/addCamera';
import Stream from './components/Client/Stream';
import Settings from './components/Client/Setting';

const Stack = createStackNavigator();

const StacksComponent=()=>{
  return (
    <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" options={{title:"", headerShown:false}} component={Home} />
        <Stack.Screen name="AddCamera" options={{title:"Add New Camera"}} component={AddCam}/>
        <Stack.Screen name="ClientStream" options={{title:"Stream"}} component={Stream}/>
        <Stack.Screen name="Setting"  option={{title:"Camera Setting"}} component={Settings}/>
    </Stack.Navigator>
  )
}

const App = () => {
  const [restart, setRestart] = React.useState(false);

  React.useEffect(()=>{
    const call = async ()=>{
      await SyncStorage.init().then(res=>{
        console.log('ready in promis',res);
        setRestart(true);
      });
    };
    call();
  });

  return (
    <NavigationContainer>
      {
        restart ?
        <StacksComponent/>
        :
        null
      }
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
