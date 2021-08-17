import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Portal, Dialog } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import { Picker as SelectPicker } from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import Countries from '../../model/countries'
import UrlServices from '../../mixins/Services/UrlServices';
import AsyncStorage from '@react-native-community/async-storage';

const UserProfileData = ({dataUser, have_bets}) => {

    console.log("a", have_bets);

    const [visible, setVisible] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [errorA, setError] = React.useState("");

    const [data, setData] = React.useState({
        name: '',
        lastname: '',
        service: '',
        country: '',
        date_selected: '',
        bet_house: '',
        email: '',
        password: '',
        confirm_password: '',
        error_message: '',
        viewSecure: true,
        viewSecure2: true,
    });
    

    if (dataUser !== null && dataUser !== '') {
        return(
            <>
                
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
              message={errorA}
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
        )
    } else {
        return(
            <View style={styles.card}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.title_white}>Cargando...</Text>
                </View>
            </View>
        )
    }
   
}

export default UserProfileData;
let widthScreen = Dimensions.get('window').width / 1.10;
let heightScreen = Dimensions.get('window').height;
let widthButton = Dimensions.get('window').width / 1.28;
const styles = StyleSheet.create({
    card:{
        flex: 1, 
        justifyContent: 'flex-start', 
        alignContent: 'center',
        width: widthScreen,
        // height: heightScreen,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: '#131011',
        borderRadius: 5
    },
    container_title:{
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
        width: widthScreen,
    },
    title_white:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        marginBottom: -10
    },
    card_green:{
        color: '#01CD01',
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        marginBottom: -10
    },
    card_white_small:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        marginBottom: -10
    },
    textSign: {
        color: 'red',
        fontFamily: 'Montserrat-Medium',
        fontSize: 13,
    },
    signIn: {
        width: widthButton,
        height: 40,
        borderRadius: 5,
        flexDirection: 'row',
        marginTop: 10,
        color: '#fff',
        borderColor: '#fff',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 15,
        paddingLeft: 10
    },
    action_picker: {
        flexDirection: 'row',
        marginTop: 10,
        color: '#fff',
        backgroundColor: '#131011',
        borderColor: '#fff',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 7,
        paddingLeft: 10,
        marginLeft: 23,

        width: '85%',
    },
    picker: {
        height: 30, 
        width: '100%', 
        paddingBottom: 5,
        marginBottom: 7,
        marginTop: -5,
        color: '#fff',
    },
    textInput: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Platform.OS === 'ios' ? 0 : -15,
      paddingLeft: 10,
      color: '#fff'
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        color: '#fff',
        borderColor: '#fff',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 15,
        paddingLeft: 10
      },
      text_header: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        marginBottom: 20,
    },
})
