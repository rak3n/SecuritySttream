import React from 'react';
import {View, Text, TextInput, ToastAndroid, StyleSheet, TouchableOpacity} from 'react-native';
import {CAMERA_KEY} from '../Storage';
import SyncStorage from 'sync-storage';
import axios from 'axios';
import { client } from '../../config/URL';

const AddCam = ({navigation})=>{
    const [id, setId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [nickname, setNickName] = React.useState('');

    const saveCamera = async () =>{
      console.log(client.getSettings);
      console.log({
        cameraID: id,
        password,
      });
        await axios({
          method:'POST',
          url: client.getSettings,
          data:{
            cameraID: id,
            password: password,
            nickname: nickname,
          },
        }).then(({data})=>{
          console.log(data);
          if (data.success){
            if (data.data){
              var cams = SyncStorage.get(CAMERA_KEY);
              console.log(cams);
              if (!cams){
                  cams = [];
              }
              cams = [...cams, data.data];
              SyncStorage.set(CAMERA_KEY, cams);
              console.log(SyncStorage.get(CAMERA_KEY));
              navigation.goBack();
            } else {
              ToastAndroid.show("Invalid camera configs !", ToastAndroid.SHORT);
              setPassword('');
              setId('');
              setNickName('');
            }
          } else {
            setPassword('');
            setId('');
            setNickName('');
            ToastAndroid.show(data.error || "Credentials are invalid !", ToastAndroid.SHORT);
          }
        }).catch(err=>{
          ToastAndroid.show("Something went wrong !", ToastAndroid.SHORT);
          console.log(err);
        });

        // var cams = SyncStorage.get(CAMERA_KEY);
        // console.log(cams);
        // if (!cams){
        //     cams = [];
        // }
        // cams = [...cams, {id, password, nickname}];
        // SyncStorage.set(CAMERA_KEY, cams);
        // console.log(SyncStorage.get(CAMERA_KEY));
        // navigation.goBack();
    };

    return (
        <View style={style.login}>
      <TextInput
        style={style.inputs}
        value={id}
        placeholder="Device Id"
        onChangeText={(id)=>{
            setId(id);
        }}
        placeholderTextColor="#7e7e7e"/>
      <TextInput
        style={style.inputs}
        placeholder="Password"
        value={password}
        onChangeText={(pass)=>{
            setPassword(pass);
        }}
        placeholderTextColor="#7e7e7e"/>
      <TextInput
        style={style.inputs}
        placeholder="Nick Name"
        value={nickname}
        onChangeText={(name)=>{
            setNickName(name);
        }}
        placeholderTextColor="#7e7e7e"/>
      <TouchableOpacity
         style={style.button}
         onPress={saveCamera}
       >
         <Text style={ {color: '#fff'} }> Done </Text>
       </TouchableOpacity>
    </View>
    );
}

const style = StyleSheet.create({
    login: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding:16,
      backgroundColor: '#FFF',
    },
    heading:{
        color: '#000000',
        fontSize:36,
        fontWeight: 'bold',
        // marginBottom:20,
        paddingBottom: 60,
    },
    inputs:{
        width:'100%',
        borderBottomWidth:0.7,
        borderBottomColor:'#7E7E7E',
        color: '#000',
        marginBottom:22,
    },
    button:{
        backgroundColor:'#b8b6b6',
        borderRadius: 4,
        marginTop:50,
        justifyContent:'center',
        alignItems:'center',
        padding:12,
        paddingLeft:50,
        paddingRight:50,
    },
  });

export default AddCam;
