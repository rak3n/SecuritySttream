import React from 'react';
import Login from './login';
import {View} from 'react-native';
import Stream from './Stream';

const Host=({setHost})=>{
    const [auth, setAuth] = React.useState(false);
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
}

export default Host;
