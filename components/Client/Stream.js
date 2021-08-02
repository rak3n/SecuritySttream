/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { mediaDevices, RTCView } from 'react-native-webrtc';
import Peer from 'react-native-peerjs';

const peer = new Peer();

const Stream = ({route, navigation})=>{
    const {hostId} = route.params;
    console.log(hostId);
    const [stream, setStream] = React.useState(false);

    const makeCall = (id, localStream) => {
        var call;
        call = peer.call(id, localStream);
        // console.log(call);

        call.on('stream', (streamRec)=>{
            console.log('hello', streamRec.toURL());
            setStream(streamRec);
        }, err=>{
            console.log(err);
        });
        // sendRecieveData(id);
        // setConnection(true);
    };

    const getStream = (videoSourceId, isFront)=>{
        mediaDevices.getUserMedia({
            audio: false,
            video: {
              width: 640,
              height: 480,
              frameRate: 30,
              facingMode: (isFront ? 'user' : 'environment'),
              deviceId: videoSourceId,
            }
          })
          .then(streamGot => {
              makeCall(hostId, streamGot);
          })
          .catch(error => {
            console.log(error);
          });
    }

    React.useEffect(() =>{
        mediaDevices.enumerateDevices().then(sourceInfos => {
            // console.log(sourceInfos);
            // let videoSourceId;
            let isFront = false;
            // for (let i = 0; i < sourceInfos.length; i++) {
            //   const sourceInfo = sourceInfos[i];
            //   if(sourceInfo.kind == 'videoinput' && sourceInfo.facing === (isFront ? 'front' : 'environment')) {
            //     videoSourceId = sourceInfo.deviceId;
            //   }
            // }
            getStream('0', isFront);
        });
    },[]);

    return (
        <View style={{flex:1, backgroundColor:'#fff',}}>
            <View style={{flex:1,justifyContent:'center', alignItems:'flex-end', marginRight:20}}>
                <Text style={styles.motionText}>[Motion Detected]</Text>
                <Text style={styles.watchingText}>[Alarm Paused- 1 Watching]</Text>
            </View>
            <View style={{flex:5, width:'100%'}}>
                <TouchableOpacity>
                    {
                        stream ?
                            <RTCView
                                style={{width:'100%', height:400}}
                                streamURL={stream.toURL()}
                             />
                        :
                            null
                    }
                    {/* <Text style={styles.fullScreenText}>View in Full Screen</Text> */}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    motionText:{
        color:'#24FF00',
        fontSize:12,
        lineHeight:24,
        fontWeight:'700',
    },
    watchingText:{
        color:'#FF005C',
        fontSize:12,
        lineHeight:24,
        fontWeight:'700',
    },
    fullScreenText:{
        fontSize:14,
        fontWeight:'700',
        lineHeight:19.04,
        textDecorationLine: 'underline',
        color:'#0057ad',
        textAlign:'center',
        padding:10,
    },
})

export default Stream;