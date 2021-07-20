/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import { mediaDevices, RTCView } from 'react-native-webrtc';
import Detect from './MotionDetect';
import Peer from 'react-native-peerjs';

var counter = new Set();

const Stream = (props)=>{
    const [stream, setStream] = React.useState(false);

    const header = (
        <View style={styles.header}>
            <View style={{justifyContent:'center', alignItems:'flex-start'}}>
                <Text style={{fontWeight:'500', fontSize: 16, lineHeight:20, color:'white'}}>Senstivity: <Text style={{color:'#00B2FF'}}>10%</Text></Text>
                <Text style={{fontWeight:'500', fontSize: 16, lineHeight:20, color:'white'}}>Resolution: <Text style={{color:'yellow'}}>768x480p</Text></Text>
            </View>
            <TouchableOpacity
                style={{justifyContent:'center', alignItems:'center'}}
                onPress={()=>props.setAuth(false)}>
                <Text style={{color:'white', fontSize: 16, lineHeight:20, borderBottomWidth: 0.6, borderColor:'white'}}>Logout</Text>
            </TouchableOpacity>
        </View>
    );

    const body = (
        <View style={styles.body}>
            {
                stream ?
                    <RTCView
                        style={{width:'95%', height:480}}
                        streamURL={stream.toURL()}
                     />
                :
                    null
            }
        </View>
    );

    const footer = (
        <View style={styles.footer}>
            <View style={{height:14, borderRadius:4, width:'100%', backgroundColor:'#00B2FF'}} />
            <View style={{height:14, borderRadius:4, width:'100%', backgroundColor:'#00FF47'}} />
            <View style={{height:14, borderRadius:4, width:'100%', backgroundColor:'#FF007A'}} />
        </View>
    );
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
          .then(streamRec => {
            //   console.log("stream", streamRec);
              OnlyListenCall(streamRec);
          })
          .catch(error => {
            // Log error
          });
    };

    const OnlyListenCall = (gStream)=>{
        const peer = new Peer();
        peer.on('error',(err)=>{
            console.log(err);
        });
        peer.on('open', localPeerId=>{
            console.log(localPeerId);
            setStream(gStream);

        peer.on('call', call=>{
          console.log('connect Req');
          console.log('call got', call, gStream);
          call.answer(gStream);
        });

        peer.on('connection', conn=>{
            counter.add(conn.peer);
            console.log(conn);
            console.log(counter.size + ' online');
            // conn.on('data', data=>{
            //     console.log('new message', data);
            //     if(data.shouldTrack!==undefined)
            //         {setShouldTrack(data.shouldTrack);}
            //     if(data.shouldTrack===undefined && data!=='disconnected'){
            //         setShouldTrack(false);
            //     }
            //     if(data==='disconnected'){
            //       counter.delete(conn.peer);
            //       console.log(counter.size+' online')
            //       if(counter.size<1){
            //           counter=new Set();
            //           setShouldTrack(true);
            //       }
            //     }
            //     conn.send('Ok')
            // })
        });
    });
    };

    React.useEffect(() =>{
            mediaDevices.enumerateDevices().then(sourceInfos => {
                // console.log(sourceInfos);
                // let videoSourceId;
                let isFront = false;
                // for (let i = 0; i < sourceInfos.length; i++) {
                //   const sourceInfo = sourceInfos[i];
                //   if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                //     videoSourceId = sourceInfo.deviceId;
                //   }
                // }
                getStream('0', isFront);
            });
    },[]);

    return (
    <View
      style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black'}}
      >
        {header}
        {body}
        {footer}
        {
            stream ?
            // <Detect videoStream={stream}/>
            <View/>
            :
            null
        }
    </View>
    );
};

const styles = StyleSheet.create({
    header:{
        flexDirection:'row',
        flex:1,
        color:'white',
        justifyContent:'space-between',
        width:'100%',
        padding: 16,
        maxHeight:100,
    },
    body:{
        flex:3,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'black',
    },
    footer:{
        flex:2,
        maxHeight: 200,
        width:'100%',
        padding: 20,
        justifyContent:'space-around',
        alignItems:'center',
    },
});

export default Stream;
