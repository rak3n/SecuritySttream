/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {mediaDevices, RTCView} from 'react-native-webrtc';
import Detect from './MotionDetect';
import Peer from 'react-native-peerjs';
import syncStorage from 'sync-storage';
import { HOST_CAMERA_LOGIN_KEY } from '../Storage';
import axios from 'axios';
import { host } from '../../config/URL';
import {database} from '../../config/fire';
import TimeConver from '../Utils/timeConver';

var peer;
var motionTimeLoop;
var motionTimeObj = {};

const Stream = props => {
  const [stream, setStream] = React.useState(false);
  const [motion, setMotion] = React.useState(false);
  const [isPeerConnected, setIsPeerConnected] = React.useState(false);
  const [coolDownMotion, setCoolDownMotion] = React.useState(false);
  const [blinkStreamColor, setBlinkStreamColor] = React.useState('');
  const [phonesArr, setPhoneArr] = React.useState([]);
  const [sensi, setSensi] = React.useState(70);
  const [hardMotionDetect, setHardMotionDetect] = React.useState(true);

  //NON State dependence Variables;;;;;;;;;;;;;;;;;;;;;;;;;;;
  var streamNotReadyInterval;
  const ALERT_COOLDOWN_INTERVAL = 5 * 60 * 1000; //Seconds after to sendMessage;
  //;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

  React.useEffect(() => {
    if (!isPeerConnected) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      streamNotReadyInterval = setInterval(() => {
        setBlinkStreamColor(streamColor => {
          if (streamColor === '#000') {
            return '#00FF47';
          } else {
            return '#000';
          }
        });
      }, 600);
    } else {
      clearInterval(streamNotReadyInterval);
    }

    return () => {
      clearInterval(streamNotReadyInterval);
    };
  }, [stream]);

  const liveTimeCheck = ()=>{
    /**
     * motionTimeObj = {
        start: data.data.alertStart,
        end: data.data.alertEnd,
        switchType: data.data.alertSettings === "scheduled" ? "Schedule" : "Switch",
        motionDetect: data.data.switchState,
      };
     */
    // console.log("-----------------------------------------------------------");
    // console.log(motionTimeObj);
    if (motionTimeObj.switchType === "Scheduled" && motionTimeObj.start && motionTimeObj.end){
      var shouldDetectMotion = TimeConver(motionTimeObj.start, motionTimeObj.end);
      setHardMotionDetect(shouldDetectMotion);
    }
    else
    {
      setHardMotionDetect(motionTimeObj.motionDetect ? true : false);
    }
  };

  const sendMessageAPI = async () => {
    if (!coolDownMotion) {
      setCoolDownMotion(true);

      //Make Call on Motion Detection;;;;;;;;
      await axios({
        method:'GET',
        url:host.makeCall(phonesArr),
      }).then(res=>{
        // console.log(res);
      }).catch(err=>{
        console.log(err);
      });
      //;;;;;;;;;;;;;

      //Allow Calling to User after ALERT_COOLDOWN_INTERVAL microseconds;;;;;;;
      setTimeout(()=>setCoolDownMotion(false), ALERT_COOLDOWN_INTERVAL);
    }
  };

  const handleMotion = () => {
    setMotion(true);

    sendMessageAPI();

    setTimeout(() => {
      setMotion(false);
    }, 200);
  };

  const handleLogoutReq = async ()=>{
    let cameraObj = syncStorage.get(HOST_CAMERA_LOGIN_KEY);
    console.log(cameraObj);
    await axios({
      url: host.logout,
      method: 'POST',
      data: cameraObj,
    })
    .then(_=>{
      props.setAuth(false);
      syncStorage.set(HOST_CAMERA_LOGIN_KEY, false);
    })
    .catch(err=>{
      console.log(err);
    });
  };

  const header = (
    <View style={styles.header}>
      <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
        <Text
          style={{
            fontWeight: '500',
            fontSize: 16,
            lineHeight: 20,
            color: 'white',
          }}>
          Sensitivity: <Text style={{color: '#00B2FF'}}>10%</Text>
        </Text>
        <Text
          style={{
            fontWeight: '500',
            fontSize: 16,
            lineHeight: 20,
            color: 'white',
          }}>
          Resolution: <Text style={{color: 'yellow'}}>768x480p</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={{justifyContent: 'center', alignItems: 'center'}}
        onPress={()=>handleLogoutReq()}>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            lineHeight: 20,
            borderBottomWidth: 0.6,
            borderColor: 'white',
          }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );

  const body = (
    <View style={styles.body}>
      {
        hardMotionDetect ?
        stream === false ? (
          <View style={{width: '95%', height: '100%'}}>
            <Detect handleMotion={handleMotion} senstivity={100 - sensi}/>
          </View>
        ) : stream === true ?
          null
        :
          <RTCView
            style={{width:'100%', height:400}}
            streamURL={stream.toURL()}
          />
        : stream === true || stream === false?
          null
        :
          <RTCView
          style={{width:'100%', height:400}}
          streamURL={stream.toURL()}
      />
      }
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <View
        style={{
          height: 14,
          borderRadius: 4,
          width: '100%',
          backgroundColor: '#00B2FF',
        }}
      />
      <View
        style={[
          {height: 14, borderRadius: 4, width: '100%'},
          {
            backgroundColor: isPeerConnected ? '#00FF47' : blinkStreamColor,
            borderRadius: 4,
          },
        ]}
      />
      <View
        style={{
          height: 14,
          borderRadius: 4,
          width: '100%',
          backgroundColor: motion ? 'yellow' : '#FF007A',
        }}
      />
    </View>
  );
  const getStream = React.useCallback((videoSourceId, isFront, callback) => {
    mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: 640,
          height: 480,
          frameRate: 30,
          facingMode: isFront ? 'user' : 'environment',
          deviceId: videoSourceId,
        },
      })
      .then(streamRec => {
        callback(streamRec);
      })
      .catch(error => {
        // Log error
      });
  }, []);

  const OnlyListenCall = React.useCallback(
    () => {
      peer = new Peer();
      peer.on('error', err => {
        console.log(err);
      });
      peer.on('open', localPeerId => {
        console.log(localPeerId);
        setIsPeerConnected(true);
        database.ref('cameraListeners/' + syncStorage.get(HOST_CAMERA_LOGIN_KEY).cameraID + '/sessionID').set(localPeerId);

          peer.on('call', call => {
          console.log('connect Req');
          setStream(true);
          getStream('0', false, (gStream)=>{call.answer(gStream); setStream(gStream);});
        });
      });
    },
    []
  );

  const getAndSetAllSettings = async (cameraObj) =>{
    //Get HOST setting set by clients.
    await axios({
      method:'POST',
      url: host.getSetting,
      data: cameraObj,
    }).then(async ({data})=>{

      //Set the setting for the current Page
      // console.log(data.data);
      motionTimeObj = {
        start: data.data.alertStart,
        end: data.data.alertEnd,
        switchType: data.data.alertSettings === "scheduled" ? "Schedule" : "Switch",
        motionDetect: data.data.switchState,
      };
      liveTimeCheck();

      setPhoneArr(data.data.phoneNumbers || []);
      setSensi(data.data.sensitivity === undefined ? 70 : data.data.sensitivity);
    }).catch(err=>{
      console.log(err);
    });
  };

  //React UseEffect Hook
  React.useEffect(() => {
    OnlyListenCall();
    motionTimeLoop = setInterval(liveTimeCheck, 5000);
    const cameraObj = syncStorage.get(HOST_CAMERA_LOGIN_KEY);
    database.ref('cameraListeners').child(cameraObj.cameraID + '/settingsLastUpdate:').on('value',snapshot=>{
      getAndSetAllSettings(cameraObj);
    });
    return ()=>{
      clearInterval(motionTimeLoop);
    };
  }, []);

  React.useEffect(()=>{
    const cameraObj = syncStorage.get(HOST_CAMERA_LOGIN_KEY);
    getAndSetAllSettings(cameraObj);
    if (hardMotionDetect){
      database.ref('cameraListeners/' + cameraObj.cameraID + '/connected').on('value',snapshot=>{
        const count = snapshot.val();
        if (count === 0){
          setStream(false);
        }
      });
    }
  },[hardMotionDetect]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      {header}
      {body}
      {footer}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    color: 'white',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    maxHeight: 100,
  },
  body: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center',
    backgroundColor: 'black',
    marginBottom: 20,
  },
  footer: {
    flex: 1,
    maxHeight: 200,
    width: '100%',
    padding: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default Stream;
