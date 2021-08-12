import React from 'react';
import {
  requireNativeComponent,
  View,
  StyleSheet,
} from 'react-native';

var iface = {
  name: 'SurfaceView',
  propTypes: {
    ...View.propTypes, //the default view properties
  },
};

const NativeSurfaceView = requireNativeComponent('SurfaceView', iface);


const SurfaceView = (props)=>{

  const onMotionDetect = ()=>{
    props.gotMotion();
  };

  // console.log(props.senstivity);

    return (
      <View style={{width:'100%', height:'100%', backgroundColor:'green'}}>
          <NativeSurfaceView
            onMotion={onMotionDetect}
            senstivity={props.senstivity}
            style={{position:'absolute', top:0, left:0, right:0, bottom:0}}
          />
      </View>
    );
};


export default SurfaceView;

const styles = StyleSheet.create({
  text:{
    color: 'green',
  },
});
