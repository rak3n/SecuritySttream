import React from 'react';
import Login from './login';
import {View} from 'react-native';
import Stream from './Stream';
import syncStorage from 'sync-storage';
import { HOST_CAMERA_LOGIN_KEY } from '../Storage';

const Host = ({setHost})=>{
    const [auth, setAuth] = React.useState(false);

    React.useEffect(()=>{
        let hostLogin = syncStorage.get(HOST_CAMERA_LOGIN_KEY);
        if (hostLogin){
            setAuth(true);
        }
    },[]);

    return (
        <View style={{flex:1}}>
            {
                auth ?
                    <Stream setAuth={setAuth}/>
                :
                    <Login setHost={setHost} setAuth={setAuth}/>
            }
        </View>
    );
};

export default Host;
