import React from 'react';
import {View, Text, Image} from 'react-native';

import motionIco from './../../assets/motionSensorIco.png';
import swicthIco from './../../assets/switchIco.png';
import timerIco from './../../assets/timerIco.png';



const MotionDetectSignifier = ({type, start, end}) => {
  const motionON = (
      <View>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image source={motionIco} />
      <Text style={{marginLeft: 7, fontSize: 12, letterSpacing: -0.3}}>
        Motion Detect
      </Text>
      <Text
        style={{
          color: '#24ff00',
          fontWeight: '700',
          lineHeight: 16.34,
          letterSpacing: -0.3,
          fontSize: 12,
          marginLeft: 5,
        }}>
        ON
      </Text>
    </View>

<View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', borderColor:'#24ff00', borderWidth:2, borderRadius: 4, paddingLeft:10, paddingRight:10, paddingTop:5, paddingBottom:5, marginTop:7}}>
<Image source={swicthIco}/>
<Text style={{fontSize: 14, letterSpacing: -0.3, textAlign:'center', lineHeight: 19.07, fontWeight:'600', color:'#24ff00'}}>Turn ON</Text>
</View>
    </View>
  );

  const motionOFF = (
      <View>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image source={motionIco} />
      <Text style={{marginLeft: 7, fontSize: 12, letterSpacing: -0.3}}>
        Motion Detect
      </Text>
      <Text
        style={{
          color: '#ff0000',
          fontWeight: '700',
          lineHeight: 16.34,
          letterSpacing: -0.3,
          fontSize: 12,
          marginLeft: 5,
        }}>
        OFF
      </Text>
    </View>

    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', borderColor:'#f00f00', borderWidth:2, borderRadius: 4, paddingLeft:10, paddingRight:10, paddingTop:5, paddingBottom:5, marginTop:7}}>
        <Image source={swicthIco}/>
        <Text style={{fontSize: 14, letterSpacing: -0.3, textAlign:'center', lineHeight: 19.07, fontWeight:'600', color:'#ff0000'}}>Turn OFF</Text>
    </View>
    </View>
  );

  const motionSwitch = (
      <View>
    <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Image source={motionIco} />
    <Text style={{marginLeft: 7, fontSize: 12, letterSpacing: -0.3}}>
      Motion Detect
    </Text>
    <Text
      style={{
        color: '#ff0000',
        fontWeight: '700',
        lineHeight: 16.34,
        letterSpacing: -0.3,
        fontSize: 12,
        marginLeft: 5,
      }}>
      OFF
    </Text>
  </View>

  <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', borderColor:'#c4c4c4', borderWidth:2, borderRadius: 4, paddingLeft:10, paddingRight:10, paddingTop:5, paddingBottom:5, marginTop:7}}>
        <Image style={{marginRight:4}} source={timerIco}/>
        <Text style={{fontSize: 10, letterSpacing: -0.3, textAlign:'center', lineHeight: 19.07, fontWeight:'600', color:'#979797'}}>{start} - {end}</Text>
    </View>
  </View>
  )

  if(type==="ON")
    return motionON;
  else if(type=="OFF")
    return motionOFF;
  else if(type="Switch" && start && end)
    return motionSwitch;    
  else
    return (<View></View>);     
};

export default MotionDetectSignifier;
