import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import {host} from '../../config/URL';
import axios from 'axios';
import SyncStorage from 'sync-storage';
import { HOST_CAMERA_LOGIN_KEY } from '../Storage';

const ACCOUNT_NOT_EXIST_ERR = "camera account does not exist";
const ACCOUNT_IN_USE_ERR = "One device already logged in with this ID";

const Login = (props) => {
  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [incorrect, setIncorrect] = React.useState(false);
  const [logout, setLogout] = React.useState(false);
  const [alert, setAlert] = React.useState(false);

  const IncorrectPopUp = (
      <View style={style.popup}>
          <Text style={style.popupHead}>ERROR</Text>
          <Text style={style.popupDesc}>The Camera Id/Password are Incorrect</Text>
          <TouchableOpacity
            onPress={()=>setIncorrect(false)}>
              <Text style={style.popupBack}>GO BACK</Text>
          </TouchableOpacity>
      </View>
  );

  const AlertPopUp = (
    <View style={style.popup}>
        <Text style={style.popupHead}>ERROR</Text>
        <Text style={style.popupDesc}>The Camera Id/Password are Incorrect</Text>
        <TouchableOpacity onPress={()=>{
            setAlert(false);
            setLogout(true);
        }}>
            <Text style={style.popupLogout}>LOG OUT ACTIVE CAMERA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>setAlert(false)}>
            <Text style={style.popupBack}>CANCEL</Text>
        </TouchableOpacity>
    </View>
    );

    const ConfirmPopUp = (
        <View style={style.popup}>
            <Text style={style.popupHead}>ARE YOU SURE?</Text>
            <Text style={style.popupDesc}>The Active Camera will be logged out and no longer be watching/streaming.</Text>
            <TouchableOpacity onPress={()=>handleLogoutReq()}>
                <Text style={style.popupLogout}>YES, LOG OUT</Text>
            </TouchableOpacity>

        </View>
        );

  const handleLogoutReq = async ()=>{
      console.log('logout');
      await axios({
          method:'POST',
          data:{
            cameraID: id,
            password: password,
          },
          url: host.logout,
      }).then(({data})=>{
        //   console.log(data);
          if (data.success){
            setLogout(false);
            setId('');
            setPassword('');
          }
      }).catch(err=>{
          console.log(err);
      });
  };

  const makeUserLoginReq = async () => {
      await axios({
          method:'POST',
          url: host.login,
          data:{
            cameraID: id,
            password: password,
          },
      }).then(res=>{
          let status = res.data.success;
          if (!status){
              console.log(res.data);
              if (res.data.error === ACCOUNT_NOT_EXIST_ERR){
                  setIncorrect(true);
              } else if (res.data.error === ACCOUNT_IN_USE_ERR){
                  setAlert(true);
              } else {
                 setIncorrect(true);
              }
          }
          else {
              SyncStorage.set(HOST_CAMERA_LOGIN_KEY, {
                  cameraID: id,
                  password,
              });
              props.setAuth(true);
          }
      }).catch(err=>{
          console.log(err);
      });
    // ()=>props.setAuth(true);
  };

  return (
    <View style={style.login}>
      <Text style={style.heading}>TUSC One</Text>
      <TextInput
        style={style.inputs}
        placeholder="Device Id"
        value={id}
        onChangeText={(id)=>{
            setId(id);
        }}
        placeholderTextColor="#7e7e7e"/>
      <TextInput
        style={style.inputs}
        value={password}
        placeholder='Password'
        onChangeText={(pass)=>{
            setPassword(pass);
        }}
        placeholderTextColor="#7e7e7e"/>
      <TouchableOpacity
         style={{...style.button, backgroundColor: id.length && password.length ?'#0057ad':'#b8b6b6'}}
         onPress={id.length && password.length ? makeUserLoginReq : null}
       >
         <Text style={{color:'#fff'}}> Continue </Text>
       </TouchableOpacity>

       <TouchableOpacity style={{marginTop:10}} onPress={()=>props.setHost(false)}>
           <Text style={{textDecorationLine:'underline', color:'#0057AD', fontSize:14, fontWeight:'700'}}>Go as a Client</Text>
       </TouchableOpacity>

        <Dialog
            visible={incorrect}>
            <DialogContent>
                {IncorrectPopUp}
            </DialogContent>
        </Dialog>

        <Dialog
            visible={alert}>
            <DialogContent>
                {AlertPopUp}
            </DialogContent>
        </Dialog>

        <Dialog
            visible={logout}>
            <DialogContent>
                {ConfirmPopUp}
            </DialogContent>
        </Dialog>
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
      marginBottom:20,
      paddingBottom: 60,
  },
  inputs:{
      width:'100%',
      borderBottomWidth:0.7,
      borderBottomColor:'#7E7E7E',
      color: Colors.black,
      marginTop:22,
  },
  button:{
      backgroundColor:'#b8b6b6',
      borderRadius: 4,
      marginTop:50,
      width:'90%',
      justifyContent:'center', 
      alignItems:'center',
      padding:12,
  },
  popup:{
      backgroundColor:'#fff',
      justifyContent:'center',
      alignItems:'center',
  },
  popupHead:{
      fontSize:16,
      lineHeight:21.79,
      fontWeight:'700',
      padding:10,
  },
  popupDesc:{
      fontWeight:'400',
      lineHeight:19.07,
      fontSize:14,
      padding:7,
      textAlign:'center'
  },
  popupBack:{
      fontWeight:'700',
      fontSize:16,
      lineHeight:21.79,
      borderBottomWidth:0.8,
      borderColor:'#0057ad',
      color:'#0057ad',
      marginTop:16
  },
  popupLogout:{
    fontWeight:'700',
    fontSize:16,
    lineHeight:21.79,
    borderBottomWidth:0.8,
    borderColor: 'red',
    color: 'red',
    marginTop:16,
},
});

export default Login;
