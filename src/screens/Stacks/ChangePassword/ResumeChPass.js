import React, { useEffect, useState } from 'react';
import { View, 
    StyleSheet, 
    StatusBar, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    Platform, 
    TextInput, 
} from 'react-native';
import { Portal, Text, Dialog, Title } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import Feather from 'react-native-vector-icons/AntDesign';
import Feather2 from 'react-native-vector-icons/Feather';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import UserProfile from '../../../mixins/Profile/UserProfile'
import UserProfileData from '../../../mixins/Profile/UserProfileData'
import Layer from '../../../assets/img/svg/Layer.svg'

const ChangePassword = ({navigation}) => {

    const [data, setData] = React.useState({
        error_message: '',
    });

    const theme = useTheme();
    

  //this hook calls the token function
//   useEffect(() => {
//     obtainToken()
//   }, []);

  //state hooks for popups
  const [visible, setVisible] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  
    return (
      <>
      <View style={styles.container}>
        <StatusBar barStyle= { theme.dark ? "light-content" : "dark-content" }/>
        <Animatable.View
            animation="fadeInUpBig"
            style={styles.top}
        >   
            <View style={styles.container_title}>
                <View style={styles.c1}>
                    <TouchableOpacity
                        onPress={() =>  navigation.navigate('Profile')}
                    >
                        <Feather 
                            name="close"
                            color="#fff"
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.c2}>
                {/* <TouchableOpacity
                        onPress={() => changePassword()}
                    >
                        <Feather 
                            name="check"
                            color="green"
                            size={30}
                        />
                    </TouchableOpacity> */}
                </View>
            </View>
            <View style={styles.container_title_img}>
                <Layer
                    width="75" 
                    style={{marginLeft: 0}}
                />
            </View>
        {/* <Text style={[styles.text_header, {marginTop: 20}]}>RECUPERAR CONTRASEÑA</Text> */}
        </Animatable.View>
        <Animatable.View
            animation="fadeInUpBig"
            style={styles.bot}
        >
            <ScrollView style={styles.scrollviewSize} showsVerticalScrollIndicator={false}>
                <View style={styles.change_p}>
                    <View style={{justifyContent: 'center', alignItems: 'center', height: 50}}>
                        <Title style={styles.title_white}>Se ha actualizado tu contraseña</Title>
                    </View>
                </View>
            </ScrollView>
        </Animatable.View>
      </View>
      <View>
        <Portal>
              <StatusBar
                  barStyle={Platform.OS === true && theme.dark ? 'light-content' : 'light-content'}
                  backgroundColor='#000000'
              />
              <Dialog 
                  visible={visible} 
                  // onDismiss={() => setVisible(false)}
                  dismissable={false}
                  style={{borderRadius: 20, backgroundColor: 'transparent'}}
              >
                  <Dialog.ScrollArea>
                  <ScrollView contentContainerStyle={{paddingHorizontal: 24, marginTop: 50, marginBottom: 30, alignItems: 'center'}}>
                      <Spinner 
                          color={"#fff"}
                      />                          
                  </ScrollView>
                  </Dialog.ScrollArea>
              </Dialog>
          </Portal>
      </View>
      <View>
          <AwesomeAlert
              show={alert}
              showProgress={false}
              title="INFORMACIÓN"
              message={data.error_message}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={false}
              showConfirmButton={true}
              // cancelText="CANCELAR"
              confirmText="ACEPTAR"
              confirmButtonColor="#01CD01"
              contentContainerStyle={{backgroundColor: '#262222'}}
              titleStyle={{color: '#fff'}}
              messageStyle={{color: '#fff', textAlign: 'center'}}
              // onCancelPressed={() => {
              //     this.hideAlert();
              // }}
              onConfirmPressed={() => {
                  setAlert(false);
              }}
          />
      </View>
      </>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        backgroundColor: '#303030',
    },
    text_white:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        marginBottom: -10
    },
    top: {
        flex: 1, 
        alignItems: 'center',
        width: '100%',
    },
    bot: {
        flex: 1, 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', 
    },
    container_title: {
        flexDirection: 'row',
        backgroundColor: '#171717',
    },
    container_title_img: {
        flexDirection: 'row'
    },
     c1: {
        flex:2, 
        alignItems: 'flex-start',
        padding: 10
    },
    c2: {
        flex:1, 
        alignItems: 'flex-end',
        padding: 10
    },
    text_header: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Montserrat-Bold'
    },
    scrollviewSize: {
        width: '100%'
    },
    change_p: {
        width: '100%'
    },
    text_footer: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Montserrat-SemiBold',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        color: '#fff',
        borderColor: '#01CD01',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 10,
        paddingLeft: 10
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -15,
        padding: 10,
        color: '#fff'
    },
    title_white:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 20,
        marginBottom: -10
    },
});


