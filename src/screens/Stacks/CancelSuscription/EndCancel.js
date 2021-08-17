import React from 'react';
import { 
    View, 
    TouchableOpacity, 
    Platform,
    StyleSheet ,
    StatusBar,
    ScrollView,
    Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/AntDesign';
import { Portal, Text, Dialog, TextInput} from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import UrlServices from '../../../mixins/Services/UrlServices';
import LinearGradient from 'react-native-linear-gradient';


const EndCancel = ({navigation, route}) => {

    const [data, setData] = React.useState({
        ammount: '',
        currency: '',
        name_plan: '',
        plan_id: '',
        u_token: '',
    });

    React.useEffect(() => {
        setVariables(route.params);
    }, []);

    const [visible, setVisible] = React.useState(false);
    const [disabled_pagar, setDisabled_pagar] = React.useState(data.name != '' && data.card_number != '' && data.caducidad != '' && data.cvv != '' ? true : false);
    const [alert, setAlert] = React.useState(false);


    if (route.params == null || route.params == undefined || route.params == "") {
        return(
            <View style={styles.container}>
                <Text style={styles.title_text}>Lo sentimos, no se obtuvo contenido</Text>
            </View>
        )
    } else {
        return (
            <>
                <View style={styles.container}>
                    <StatusBar backgroundColor='#131011' barStyle="light-content"/>
                    <Animatable.View
                            animation="fadeInUpBig"
                            style={styles.top}
                        >   
                            <View style={styles.container_title}>
                                <View style={styles.c1}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Home')}
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
                                        onPress={() => sendEmail(data.email)}
                                    >
                                        <Feather 
                                            name="check"
                                            color="green"
                                            size={30}
                                        />
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                        <Text style={[styles.text_header, {marginTop: 20}]}>CANCELACIÓN DEL PLAN</Text>
                        </Animatable.View>
                    <Animatable.View
                            animation="fadeInUpBig"
                            style={styles.bot}
                        >
                        <ScrollView style={styles.scrollviewSize} showsVerticalScrollIndicator={false}>
                        <View style={styles.black_square}>
                            <View style={styles.price_square}>
                                <Text style={styles.title_text}>Lamentamos mucho que dejes de formar parte del equipo pronosticodds</Text>
                                <Text style={[styles.title_text, {marginTop: 20}]}>Esperamos tenerte pronto de vuelta y que sigas siendo parte del club de los ganadores</Text>                            </View>
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
    }

    
};

// var v = this.value;
//                                                         if (v.match(/^\d{2}$/) !== null) {
//                                                             this.value = v + '/';
//                                                         }  
export default EndCancel;

const {height} = Dimensions.get("screen");
let widthScreen = Dimensions.get('window').width *1.01;
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#303030'
  },
  top: {
    flex: 1, 
    alignItems: 'center',
    width: '98%',
    marginTop: 5
  },
  bot: {
    flex: 5, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
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
  content: {
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
  },
  text_footer: {
    color: '#fff',
    fontSize: 15,
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
    width: '80%',
  },
  black_square: {
    backgroundColor: '#282424',
    padding: 15,
  },
  container_title: {
    flexDirection: 'row',
    backgroundColor: '#131011',
    justifyContent: 'center',
    alignItems: 'center',
    width: widthScreen,
    marginLeft: 7,
    marginTop: -5,
    height: 50

  },
  c1: {
    flex:2, 
    alignItems: 'flex-start',
    marginLeft: 10
  },
  c2: {
    flex:1, 
    alignItems: 'flex-end', 
    marginRight: 10
  },
  title_text:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
  },
  title_text2:{
    color: '#01CD01',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    marginTop: 10
  },
  title_text3:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    marginTop: 10
  },
  price_square:{
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

