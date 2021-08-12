import React from 'react';
import {View, StyleSheet} from 'react-native';
import SurfaceView from '../NativeViews/SurfaceView';

const Detect = (props) => {

  return (
    <View style={{width:'100%', flex:1, height:'100%', backgroundColor:'blue'}}>
        <SurfaceView senstivity={props.senstivity === undefined ? 30 : props.senstivity} gotMotion={props.handleMotion}/>
    </View>
  );
};

export default Detect;

const styles = StyleSheet.create({
  // container: { //error style
  //   height:'100%',
  //   backgroundColor: 'red',
  //   width:'100%',
  // },
  absoluteFill:{
    position:'absolute',
    top:0,
    left:0,
    bottom:0,
    right:0,
  },
  container: StyleSheet.absoluteFillObject,
});
