import React from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {CAMERA_KEY} from '../Storage';
import SyncStorage from 'sync-storage';

const AddCam=({navigation})=>{
    const [id, setId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [nickname, setNickName] = React.useState('');
    return (
        <View style={style.login}>
      <TextInput
        style={style.inputs} 
        placeholder="Device Id"
        onChangeText={(id)=>{
            setId(id);
        }}
        placeholderTextColor="#7e7e7e"/>
      <TextInput
        style={style.inputs} 
        placeholder="Password"
        onChangeText={(pass)=>{
            setPassword(pass);
        }}
        placeholderTextColor="#7e7e7e"/>
      <TextInput
        style={style.inputs} 
        placeholder="Nick Name"
        onChangeText={(name)=>{
            setNickName(name);
        }}
        placeholderTextColor="#7e7e7e"/>
      <TouchableOpacity
         style={style.button}
         onPress={()=>{
            var cams = SyncStorage.get(CAMERA_KEY);
            console.log(cams);
            if (!cams){
                cams = [];
            }
            cams = [...cams, {id, password, nickname}];
            SyncStorage.set(CAMERA_KEY, cams);
            console.log(SyncStorage.get(CAMERA_KEY));
            navigation.goBack();
         }}
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
