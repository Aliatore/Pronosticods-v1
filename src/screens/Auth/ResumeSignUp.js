import React from 'react';
import { 
    View, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    ImageBackground,
    ScrollView,
    Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/AntDesign';
import Layer from '../../assets/img/svg/Layer.svg';
import { Portal, Text, Dialog } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";

import { useTheme } from 'react-native-paper';

const ResendEmailScreen = ({navigation}) => {
    const [data, setData] = React.useState({
        error_message: ''
    });

    const [visible, setVisible] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    
    return (
        <>
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/img/png/Basket.png')} style={styles.image}>
                    <StatusBar backgroundColor='#3d3d3d' barStyle="light-content"/>
                    <Animatable.View
                        animation="fadeInUpBig"
                        style={styles.top}
                    >   
                        <View style={styles.container_title}>
                            <View style={styles.c1}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('SignInScreen')}
                                >
                                    <Feather 
                                        name="arrowleft"
                                        color="#fff"
                                        size={30}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.c2}>
                                {/* <TouchableOpacity
                                    onPress={() => setShow(true)}
                                >
                                    <Feather 
                                        name="check"
                                        color="green"
                                        size={30}
                                    />
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    </Animatable.View>
                    <Animatable.View
                        animation="fadeInUpBig"
                        style={styles.bot}
                    >
                    <Text style={[styles.text_header, {marginTop: 20, textAlign: 'center'}]}>REVISA TU BANDEJA DE CORREOS</Text>
                    <Text style={[styles.text_footer, {marginTop: 20, textAlign: 'center'}]}>EL CORREO DE CONFIRMACIÓN DE REGISTRO, YA FUE ENVIADO</Text>
                    </Animatable.View>
                    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        <Layer style={{marginBottom: 10}}/>
                    </View>
                </ImageBackground>
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

export default ResendEmailScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#009387'
  },
  top: {
    flex: 1, 
    alignItems: 'center',
    width: '98%',
    marginTop: 5
  },
  bot: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'flex-end',
  },
  signIn: {
      width: 280,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      flexDirection: 'row'
  },
  textSign: {
      color: 'red',
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 15,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text_header: {
      color: '#fff',
      fontSize: 20,
      fontFamily: 'Montserrat-Bold'
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
  text_footer: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
  },
  login: {
    width: '100%'
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -15,
    padding: 10,
    color: '#fff'
  },
  scrollviewSize: {
    width: '100%'
  },
  container_title: {
    flexDirection: 'row'
  },
  c1: {
    flex:2, 
    alignItems: 'flex-start'
  },
  c2: {
    flex:1, 
    alignItems: 'flex-end'
  },
});

