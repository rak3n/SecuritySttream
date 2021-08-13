/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ToastAndroid, AppState} from 'react-native';
import { mediaDevices, RTCView } from 'react-native-webrtc';
import Peer from 'react-native-peerjs';
import {database} from '../../config/fire';

const peer = new Peer();
const Stream = ({route, navigation})=>{
    const {hostId} = route.params;
    const [stream, setStream] = React.useState(false);

    var total = 0;

    const makeCall = (id, localStream) => {
        var call;
        call = peer.call(id, localStream);
        if (call){
            call.on('stream', (streamRec)=>{
                console.log('hello', streamRec.toURL());
                setStream(streamRec.toURL());
            }, err=>{
                console.log(err);
            });
        }
        else
        {
            ToastAndroid.show("Client/Host is Offline or not Responding !!", ToastAndroid.SHORT);
        }
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
            },
          })
          .then(streamGot => {
              database.ref('cameraListeners').child(hostId).child('sessionID').on('value', snapshot=>{
                  var peerSessionId = snapshot.val();
                  console.log(peerSessionId);
                  if (peerSessionId){
                    //   peerSessionId="79cb7640-66b5-4858-b154-1720dfa7d7ce";
                    // This is generally how a peerId looks.....
                      makeCall(peerSessionId, streamGot);
                  } else {
                    //   ToastAndroid.show('Host seems to be In-Active !', ToastAndroid.SHORT);
                  }
              });
          })
          .catch(error => {
            console.log("getStream:",error.message);
          });
    };

    const addUser = (count) => {
        // This is an unoptimised away of handling background processes for user management, having bigger reads and writes
        //, though other alternative might be optimized
        database.ref('cameraListeners').child(hostId).child('connected').get().catch(err=>console.log("gett err"))
        .then(snapshot=>{
            total = snapshot.val();
            if (total === null || total < 0)
                { if (count === -1)
                    {return;}

                    total = 0; }

            database.ref('cameraListeners').child(hostId).child('connected').set(total + count).catch(err=>console.log(err));
        }).catch(err=>{
            console.log("addUser",err.message);
        });
    };

    const handleAppStateChange = (nextAppState)=> {
        //add Remove user based on activity background or foreground;
        if (nextAppState === "active") {
            addUser(1);
          }
        else {
            addUser(-1);
        }
    };

    React.useEffect(() =>{
        mediaDevices.enumerateDevices().then(sourceInfos => {
            let isFront = false;
            addUser(1);
            getStream('0', isFront);
        });
        //Add AppState Listners
        AppState.addEventListener('change', handleAppStateChange);

        return ()=>{
            //Remove App state Listners.
            AppState.removeEventListener('change', handleAppStateChange);
            addUser(-1);
        };
    },[]);

    return (
        <View style={{flex:1, backgroundColor:'#fff'}}>
            <View style={{flex:1,justifyContent:'center', alignItems:'flex-end', marginRight:20}}>
                <Text style={styles.motionText}>[Motion Detected]</Text>
                <Text style={styles.watchingText}>[Alarm Paused- {total + 1} Watching]</Text>
            </View>
            <View style={{flex:5, width:'100%'}}>
                <TouchableOpacity>
                    {
                        stream ?
                            <RTCView
                                style={{width:400, height:400}}
                                streamURL={stream}
                             />
                        :
                            null
                    }
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
});

export default Stream;
