import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import SyncStorage from 'sync-storage';
import Host from '../Host/Host';
import { CAMERA_KEY } from '../Storage';
import MotionDetectSignifier from './MotionDetectSignifier';

//ASSETS
import watchIco from './../../assets/watchIco.png';

const Home = ({navigation})=>{

    const [cameras, setCameras] = React.useState('');
    const [host, setHost] = React.useState(false);

    const noCamera = (
        <View style={styles.camBox}>
            <Text style={styles.camDesc}>Looks like you haven’t added any cameras yet.</Text>
            <TouchableOpacity style={styles.camButton} onPress={()=>navigation.navigate('AddCamera')}>
                <Text style={{color:'white'}}>Add a new Camera</Text>
            </TouchableOpacity>
        </View>
    );

    React.useEffect(()=>{
        var unsub = navigation.addListener('focus',()=>{
            var data = SyncStorage.get(CAMERA_KEY);
            console.log(data);
            if (data){
                setCameras(data);
            }
        });

        return unsub;
    },[]);

    const renderItem = ({item})=>{
        console.log(item);
        return (
            <View style={{borderWidth:1, minHeight:128, borderColor:'black', margin:8,shadowColor:'rgba(0, 0, 0, 0.25)', backgroundColor:'white', shadowOffset:{width:0, height:4}, shadowRadius:2, elevation:10 , padding:16, borderRadius:4}}>
                <View style={styles.rowView}>
                    <Text style={styles.storeId}>ID: {item.id}</Text>
                    <TouchableOpacity
                        onPress={()=>navigation.navigate("Setting")}>
                        <Text style={styles.settingTap}>Settings</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row', paddingLeft:20, paddingRight:20, justifyContent:'space-between', alignItems:'center'}}>
                    {/* 
                    MotionDetectSignifier Component render the motionDetection off or on based on props type as:
                        1. ON: For only On component
                        2. OFF: For only Off Component
                        3: Swicth: Intelligent enough to decide on or off based on timming, using start and end time props;
                            i> start: Start Time
                            ii> end: End Time
                     */}
                    <MotionDetectSignifier type={'Switch'} start={"11:00 AM"} end={"11:00 PM"}/>

                    <TouchableOpacity style={{justifyContent:'center', alignItems:'center'}} onPress={()=>navigation.navigate("ClientStream", {hostId:item.id})}>
                        <Image source={watchIco} style={{marginBottom:2}}/>
                        <Text style={{color:'red', lineHeight:19.07, textAlign:'center', fontSize: 14, fontWeight: '700'}}>WATCH</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const scrollViewCamera = (
        <FlatList
            data={cameras}
            renderItem={renderItem}
            keyExtractor={item=>item.id}/>
    );

    if (host){
        return (<Host setHost={setHost}/>);
    }
    else
    {
        return (
            <View style={{flex:1, backgroundColor:'white'}}>
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.homeHeader}>TUSC one</Text>
                    <Text style={styles.homeDesc}>The Ultimate Security Cam Series</Text>
                    <TouchableOpacity style={{marginTop:20}} onPress={()=>setHost(true)}>
                        <Text style={{textDecorationLine:'underline', color:'#0057AD', fontSize:16, fontWeight:'bold'}}>Go as a Host</Text>
                    </TouchableOpacity>
                </View>
                {
                    cameras.length ?
                        <View style={{flex:3}}>
                            <View style={{flexDirection:'row', justifyContent:'space-between', padding:25}}>
                                <Text style={{fontSize:24, lineHeight:24, textAlign:'center', fontWeight:'700'}}>
                                    My Cameras
                                </Text>
                                <TouchableOpacity style={{transform:[{scale:2}]}} onPress={()=>navigation.navigate('AddCamera')}>
                                    <Text>+</Text>
                                </TouchableOpacity>
                            </View>
                            {scrollViewCamera}
                        </View>
                    :
                        noCamera
                }
            </View>
            );
    }
}

const styles = StyleSheet.create({
    camButton:{
        backgroundColor:'#0057AD',
        padding:10,
        marginTop:10,
        borderRadius:4,
    },
    camDesc:{
        textAlign:'center',
        width:'50%',
        minWidth:200,
        lineHeight: 14.06,
        fontSize:12,
        fontWeight:'700',
    },
    camBox:{
        flex:1,
        justifyContent: 'flex-start',
        marginTop:'30%',
        alignItems:'center',
    },
    homeHeader:{
        fontSize:36,
        lineHeight:42.19,
        textAlign:'center',
        fontWeight:'700',
    },
    homeDesc:{
        fontSize:12,
        fontWeight:'700',
        lineHeight:14.06,
        textAlign:'center',
    },
    rowView:{
        flex:1,
        flexDirection:'row',
    },
    storeId:{
        color:'#000',
        fontSize:12,
        lineHeight:16,
        letterSpacing:-0.3,
        marginRight:10,
    },
    settingTap:{
        color:'#979797',
        fontSize:11,
        lineHeight:15,
        textAlign:'right',
        letterSpacing:-0.3,
    },
});

export default Home;
