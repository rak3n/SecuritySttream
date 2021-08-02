import React from 'react';
import {View, TextInput, Text, TouchableOpacity, Image} from 'react-native';
import deleteIco from '../../assets/deleteIco.png';

const PhoneComponent = (props) =>{

    const [phoneNumber, setPhoneNumber] = React.useState(props.phone);
    const [error, setError] = React.useState(props.error);

    const removePhone = ()=>{
        props.removePhone(props.idx);
    };

    const handlePhoneChecks = (text)=>{
        if (text.length < 10 && text.length !== 0 ){
            setError(true);
        }
        else
        {
            setError(false);
        }
        setPhoneNumber(text);
    };

    const makeSubmission = () =>{
        if (!error){
            const commonArry = props.phonesArray.filter(itm=>{
                if (itm.phone === phoneNumber)
                    return true;
                else 
                    return false;
            });
            if(commonArry.length === 0)
                props.submit(props.phone,{phone: phoneNumber, error:error});
            else
                setError(true);
        }
    };

    return (
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop: props.idx !== 0?10:0}}>
            <View style={{ flex:5, marginRight:10 }}>
            <TextInput
                maxLength={10}
                value={phoneNumber}
                keyboardType='numeric'
                placeholder={"Phone Number"}
                onChangeText={handlePhoneChecks}
                onBlur={makeSubmission}
                style={
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                        color:'black',
                        borderColor: error ? 'red' : 'black' ,
                        borderWidth:1,
                        borderRadius:4,
                        padding:3,
                    }}/>
            {
            error ?
                <Text style={{textAlign:'right', fontSize:11, lineHeight:20, marginRight:7, fontWeight:'400', color:'#f00'}}>Phone Number is Invalid!</Text>
            :
                null
            }
            </View>
            <TouchableOpacity style={{flex:1, alignItems:'center', }} onPress={()=>removePhone()}>
                <Image source={deleteIco}></Image>
            </TouchableOpacity>
        </View>
    );
}

export default PhoneComponent;