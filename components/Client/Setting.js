import axios from 'axios';
import React from 'react';
import {View, TextInput, StyleSheet, Picker, Image, ScrollView, Text, Slider, Switch, Button, TouchableOpacity} from 'react-native';
// import { TimePicker } from 'react-native-simple-time-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { database } from '../../config/fire';
import { client } from '../../config/URL';
import PhoneComponent from './PhoneComponent';


const Settings = (props)=>{

    const [slide, setSlide] = React.useState(0.75);
    const [hour, setHour] = React.useState(0);
    const [minute, setMinute] = React.useState(0);
    const [visible, setVisible] = React.useState(false);
    const [endHour, setEndHour] = React.useState(12);
    const [endMin, setEndMin] = React.useState(0);
    const [endVisible, setEndVisible] = React.useState(false);
    const [isScheduled, setIsScheduled]  = React.useState(false);
    const [isDetected, setIsDetected] = React.useState(true);
    const [nickName, setNickName] = React.useState('');

    const [phones, setPhones] = React.useState([]);

    const onDismiss = React.useCallback(() => {
        if (visible)
            {setVisible(false);}

        if (endVisible)
            {setEndVisible(false)}
    }, [visible, endVisible]);

    const onConfirm = React.useCallback(
      (value) => {
        if (visible){
            setVisible(false);
            setHour(value.hours);
            setMinute(value.minutes);}
        if (endVisible){
            setEndVisible(false);
            setEndHour(value.hours);
            setEndMin(value.minutes);
        }
      },
      [visible, endVisible]
    );

    const handleSave = ()=>{
        makeSaveReq();
    };

    const handlePhoneAdd = ()=>{
        var spaceArr = phones.filter((itm)=>{
            if (itm.phone === ''){
                return 1;
            }
        });

        if (spaceArr.length === 0){
            setPhones([...phones,{phone:'', error: false}]);
        }
    };

    const saveToPhones = (prevPhone, newPhoneObj) =>{
        var tmp = phones.map(itm=>{
            if (itm.phone === prevPhone){
                return newPhoneObj;
            }
            else {
                return itm;
            }
        });
        setPhones(tmp);
    };

    const removePhone = (index)=>{
        var tmp = phones.filter((itm, idx)=>{
            if (idx === index){
                return false;
            }
            else
            {
                return true;
            }
        });

        setPhones(tmp);
    };

    const renderPhone = phones.map((itm, idx)=>{
        return (
            <PhoneComponent key={itm.phone} phone={itm.phone} phonesArray={phones} idx={idx} error={itm.error} removePhone={removePhone} submit={saveToPhones}/>
        );
    });

    const makeSaveReq = async () =>{
        var obj = {
            cameraID: props.route.params.item.cameraID,
            password: props.route.params.item.password,
            nickname: nickName,
            phoneNumbers: phones.map(itm=>itm.phone),
            sensitivity: (slide * 100).toFixed(2),
            resolutionH: 768,
            resolutionV: 480,
            alertSetting: isScheduled ? 'scheduled' : 'switched',
        };

        if (isScheduled){
            obj = {
                ...obj,
                alertStartInMinutes: (hour * 3600) + (minute * 60),
                alertEndInMinutes: (endHour * 3600) + (endMin * 60),
                alertStart: [(hour < 10 ? '0' + String(hour) : String(hour)) + ':' +  (minute < 10 ? '0' + String(minute) : String(minute))],
                alertEnd: [(endHour < 10 ? '0' + String(endHour) : String(endHour)) + ':' + (endMin < 10 ? '0' + String(endMin) : String(endMin))],
            };
        } else
        {
            obj.switchState = isDetected;
        }

        console.log(obj);
        await axios({
            method:'POST',
            data: obj,
            url: client.updateSettings,
        }).then(res=>{
            console.log(res.data);
            props.navigation.goBack();
        }).catch(err=>{
            console.log(err);
        });
    };

    const getSettings = React.useCallback(
        async (cameraID, password)=>{
            await axios({
                method:'POST',
                url: client.getSettings,
                data:{
                    cameraID,
                    password,
                },
            }).then(({data})=>{
                var camObj = data.data;
                // console.log(camObj);
                setNickName(camObj.nickname || '');
                setSlide(camObj.sensitivity / 100 || 0.75);
                if (camObj.phoneNumbers.length){

                    var phoneObj = camObj.phoneNumbers.map(itm=>{
                        return {
                            phone: itm,
                            error:'',
                        };
                    });
                    setPhones(phoneObj);
                }
                if (camObj.alertSetting === "switched"){
                    setIsScheduled(true);
                    var [startHour, startMin] = [0,0];
                    var [endTmpHour, endTmpMin] = [12,0];
                    var time;

                    console.log(camObj.alertStart);
                    if (typeof camObj.alertStart === 'number'){
                        time = camObj.alertStart[0].split(':');
                        [startHour, startMin] = time;
                    }

                    if (camObj.alertEnd.length){
                        time = camObj.alertStart[0].split(':');
                        [endTmpHour, endTmpMin] = time;
                    }

                    setHour(parseInt(startHour));
                    setMinute(parseInt(startMin));
                    setEndHour(parseInt(endTmpHour));
                    setEndMin(parseInt(endTmpMin));
                } else {
                    setIsDetected(camObj.switchState ? camObj.switchState : false);
                }
            }).catch(err=>{
                console.log(err);
            });
        },
        [],
    );

    React.useEffect(()=>{
        var {cameraID, password} = props.route.params.item;
        // console.log(cameraID, password);
        if (cameraID && password){
            getSettings(cameraID, password);
        }
    },[getSettings, props.route.params.item]);

    return (
        <ScrollView style={{flex:1, padding:16, backgroundColor:'white'}}>

            <Text style={styles.heading}>Camera ID:</Text>
            <Text style={styles.cameraHead}>{props.route.params.item.cameraID}</Text>

            <TextInput
                style={styles.nickNameBox}
                placeholder={'Nickname'}
                value={nickName}
                onChangeText={(name)=>setNickName(name)}
                placeholderTextColor='#7E7E7E'
            />

            <Text style={styles.heading}>Resolution</Text>
            <Picker
                selectedValue={'768x480p'}
                style={styles.picker}
            >
                <Picker.Item label='768x480p' value='768x480p'></Picker.Item>
            </Picker>

            <Text style={styles.heading}>Sensitivity</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%', marginTop:16}}>
                <Slider
                    thumbTintColor="#7E7E7E"
                    minimumTrackTintColor="#7E7E7E"
                    maximumTrackTintColor="#7E7E7E"
                    value={slide}
                    onValueChange={(e)=>setSlide(e)}
                    style={styles.slider}/>
                <Text style={{flex:1, marginLeft:10}}>{(slide * 100).toFixed()} %</Text>
            </View>

            <View style={{marginTop:20, flexDirection:'column'}}>
                <Text style={styles.heading}>Phone Numbers</Text>
                <View style={{marginTop:20}}>
                    {renderPhone}
                </View>
                <View style={{marginTop:10}}>
                    <TouchableOpacity onPress={handlePhoneAdd}>
                        <Text style={{fontSize:11, lineHeight:20, fontWeight:'400', color:'#0057AD', textDecorationLine:'underline'}}>
                            Add a Phone Number
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{marginTop: 20, flexDirection:'column'}}>
                <Text style={styles.heading}>Motion Detection</Text>
                <View style={{flexDirection:'row',justifyContent:'center', alignItems:'center', marginTop:20}}>
                    <Text>Switched</Text>
                    <Switch
                        style={styles.switch}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={"#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>setIsScheduled(!isScheduled)}
                        value={isScheduled}/>
                    <Text>Scheduled</Text>
                </View>

                {
                    isScheduled?
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:10}}>
                <TimePickerModal
                  visible={visible}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={12} // default: current hours
                  minutes={0} // default: current minutes
                  label="Select Start time" // optional, default 'Select time'
                  cancelLabel="Cancel" // optional, default: 'Cancel'
                  confirmLabel="Ok" // optional, default: 'Ok'
                  animationType="fade" // optional, default is 'none'// optional, default is automically detected by your system
                />
                
                <TouchableOpacity onPress={()=>setVisible(true)} style={styles.timeBox}>
                    <Text style={styles.timeText}>{(hour>10?hour:("0"+hour))+":"+(minute>10?minute:("0"+minute))}</Text>
                </TouchableOpacity>

                <TimePickerModal
                  visible={endVisible}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={12} // default: current hours
                  minutes={0} // default: current minutes
                  label="Select End time" // optional, default 'Select time'
                  cancelLabel="Cancel" // optional, default: 'Cancel'
                  confirmLabel="Ok" // optional, default: 'Ok'
                  animationType="fade" // optional, default is 'none'// optional, default is automically detected by your system
                />

                <TouchableOpacity style={styles.timeBox} onPress={()=>setEndVisible(true)}>
                    <Text style={styles.timeText}>{(endHour>10?endHour:("0"+endHour))+":"+(endMin>10?endMin:("0"+endMin))}</Text>
                </TouchableOpacity>
                </View>
                :
                <View style={{flexDirection:'row',justifyContent:'center', alignItems:'center', marginTop:20}}>
                    <Text style={{color:'#f00', fontWeight:'700'}}>OFF</Text>
                    <Switch
                        style={styles.switch}
                        trackColor={{ false: "#f00", true: "#24ff00" }}
                        thumbColor={"#f4f9f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>setIsDetected(!isDetected)}
                        value={isDetected}/>
                    <Text style={{color:'#24ff00', fontWeight:'700', }}>ON</Text>
                </View>
                }

            </View>

            <View style={{alignItems:'center', marginTop:50, marginBottom:90}}>
                <TouchableOpacity style={{...styles.saveBtn, backgroundColor: nickName.length ? '#0057ad' : '#c4c4c4'}} onPress={nickName.length ? handleSave : null}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    cameraHead:{
        fontSize:20,
        lineHeight:24,
        fontWeight: '500',
        color:'black',
        marginTop: 15,
        marginBottom: 12,
    },
    nickNameBox:{
        width:'100%',
        borderBottomWidth:0.7,
        borderBottomColor:'#7E7E7E',
        justifyContent:'center',
        alignItems:'center',
        color: 'black',
        marginBottom:20,
    },
    picker:{
        width:'100%',
        borderRadius:40,
        borderWidth:1,
        borderColor: 'red',
    },
    heading:{
        color:'#7E7E7E',
        fontSize:13,
        lineHeight:20,
        textAlign:'left',
        marginBottom:-12,
        marginTop:10,
    },
    slider:{
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        flex:4,
        marginTop:7,
    },
    switch:{
        height:30,
        marginLeft:5,
        marginRight:5,
    },
    timeBox:{
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#f0f0f0',
        borderRadius:4,
        borderWidth:2,
        margin:10,
    },
    timeText:{
        fontSize:26,
        lineHeight:21.79,
        fontWeight:'400',
        padding:10,
        paddingTop:20,
        paddingLeft:20,
        paddingRight:20,
    },
    saveBtn:{
        justifyContent:'center',
        alignItems:'center',
        borderRadius:4,
        backgroundColor:'#c4c4c4',
        width:82,
        padding:10,
    },
    saveText:{
        color:'white',
    },
});

export default Settings;
