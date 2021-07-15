import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, StatusBar, TouchableOpacity} from 'react-native';
import { Card, Title, Dialog, Portal } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Hipismo from '../../assets/img/svg/hipismoLogo.svg';
import Gold from '../../assets/img/svg/oro.svg';
import { ScrollView } from 'react-native-gesture-handler';
import UrlServices from '../../mixins/Services/UrlServices';
import Carousel, { PaginationLight } from 'react-native-x2-carousel';
import { useNavigation } from '@react-navigation/native';

const PlansScreen = () => {
  const [data, setData] = React.useState({
    client_token: '',
    client_data: null,
    data_plans: null,
    error_message: '',
  });

  const navigation = useNavigation();
  //this hook calls the token function
  useEffect(() => {
    obtainToken()
  }, []);

  const obtainToken = async () => {
    try {
        const value = await AsyncStorage.getItem('userToken');
        const data_value = await AsyncStorage.getItem('dataUser');
        let data_value_parsed = JSON.parse(data_value)
        setData({
          ...data,
          client_token: value,
          client_data: data_value_parsed
        })
        getPlans(value, data_value_parsed)
    } catch(e) {
        console.log(e);
    }
  }
  //state hooks for popups
  const [visible, setVisible] = React.useState(true);
  const [alert, setAlert] = React.useState(false);

  //api call
  const getPlans = (token_user, userdata) => {   
    let urlApi = UrlServices(1);
    setVisible(true)
    NetInfo.fetch().then(state => {
        console.log(state.isConnected);
        if (state.isConnected === true){
            if (token_user.length === 0) {
                setVisible(false)
                setAlert(true)
                setData({
                    ...data,
                    error_message: `Error al obtener el token del usuario, intente nuevamente`
                })
            } else {
                try {
                    axios({
                        method: 'get',
                        url: `${urlApi}/user/plans_avaibles`,
                        timeout: 9000,
                        headers: {
                          'Authorization': `Bearer ${token_user}`,
                          'Content-Type': 'application/json',
                          'X-Requested-With': 'XMLHttpRequest'
                        },
                        validateStatus: (status) => {
                            return true; 
                        },
                    })
                    .catch(function(error) {
                        console.log(error);
                        setVisible(false)
                        setAlert(true)
                        setData({
                            ...data,
                            error_message: `Ha ocurrido un error, ${error}`
                        })
                    })
                    .then(response => {
                        if (response.status === 200 || response.status === 201) {
                            console.log('correcto', response);
                            setVisible(false)
                            setData({
                                ...data,
                                data_plans: response.data.data,
                                client_token: token_user,
                                client_data: userdata
                            })
                        }else{
                            let error = response.data.errors
                            let parsed_error = JSON.stringify(error)
                            console.log(parsed_error);
                            setVisible(false)
                            setAlert(true)
                            setData({
                                ...data,
                                error_message: `Ha ocurrido un error, ${parsed_error}`
                            })
                        }
                    })
                } catch (err) {
                        console.log('catch de errores: ', err);
                        setVisible(false)
                        setAlert(true)
                        setData({
                            ...data,
                            error_message: `Ha ocurrido un error, ${err}`
                        })
                } 
            }
        }else{
            setData({
                ...data,
                error_message: 'Por favor, revise su conexión a internet.',
            });
            setVisible(true)
            setLoginState(false)
        }
    }); 
  }

  //render of swipeable
  const _renderItem = (item) => {
    console.log("item que llega",data);
    return (
      <View style={styles.container}>
        <ScrollView>
          
          <View style={styles.bot}>
            <Card style={styles.card_2}>
                <Card.Content>
                  <View style={{backgroundColor: '#171717', height: 50, justifyContent: 'center', alignItems: 'center'}}>
                    {item.name.toUpperCase() === "HIPISMO" ? 
                      <Hipismo 
                        width="50" 
                        style={{marginLeft: 0}}
                      />
                      : null
                    }
                    {item.nickname.toUpperCase() === "DEPORTES GENERALES" ? 
                      <Gold 
                        width="50" 
                        style={{marginLeft: 0}}
                      />
                      : null
                    }
                  </View>
                  <Title numberOfLines={1}  style={styles.bot_text_alt}>{item.nickname.toUpperCase()}</Title>
                  <View style={styles.container_swapp}>
                    <View style={styles.container_swapp2}>
                      {item.name != null && item.name == "Hipismo" ? 
                        (<FlatList
                          data={[
                            {key: 'Mas de 200 datos mensuales'},
                            {key: 'Solo hipodromos clase A en USA'},
                            {key: 'De miercoles a domingo'},
                            {key: 'Disponibilidad inmediata'},
                          ]}
                          renderItem={({item}) => <Text style={styles.bot_text2}><Text style={{color: '#01CD01'}}>&bull;</Text> &nbsp;&nbsp;{item.key}</Text>}
                        />) 
                      : 
                      (<FlatList
                          data={[
                            {key: '3 pronosticos diarios'},
                            {key: 'La jugada del dia'},
                            {key: 'Duracion de un mes'},
                            {key: 'Disponibilidad inmediata'},
                          ]}
                          renderItem={({item}) => <Text style={styles.bot_text2}><Text style={{color: '#01CD01'}}>&bull;</Text> &nbsp;&nbsp;{item.key}</Text>}
                        />) 
                      }
                    </View>
                    <Text style={styles.text_amount}>{item.amount}{item.currency === 'usd' ? "$" : null }</Text>
                    <View style={styles.button}>
                        <TouchableOpacity
                          style={styles.signIn}
                          onPress={() => console.log('skere')}
                        >
                            <LinearGradient
                                colors={['#01CD01', '#01CD01']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color:'#fff'
                                }]}>ADQUIRIR</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                  </View>
                  {/* <Paragraph numberOfLines={1} style={styles.paragraph_white}>{item.text}</Paragraph>
                  <Paragraph numberOfLines={1} style={styles.paragraph_grey}>{item.text}</Paragraph> */}
                </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }
  const render = (data) => {
    console.log("item que llega",data);
    return (
      <Card style={styles.card}>
      <Card.Content>
        <Title numberOfLines={1}  style={styles.bot_text}>{data.name != null ? data.name : null}</Title>
        <View style={styles.container_swapp}>
          <View style={styles.container_swapp2}>
          {data.name != null && data.name == "Hipismo" ? 
            (<FlatList
              data={[
                {key: 'Mas de 200 datos mensuales'},
                {key: 'Solo hipodromos clase A en USA'},
                {key: 'De miercoles a domingo'},
                {key: 'Disponibilidad inmediata'},
              ]}
              renderItem={({item}) => <Text style={styles.bot_text2}><Text style={{color: '#01CD01'}}>&bull;</Text> &nbsp;&nbsp;{item.key}</Text>}
            />) 
          : 
          (<FlatList
              data={[
                {key: '3 pronosticos diarios'},
                {key: 'La jugada del dia'},
                {key: 'Duracion de un mes'},
                {key: 'Disponibilidad inmediata'},
              ]}
              renderItem={({item}) => <Text style={styles.bot_text2}><Text style={{color: '#01CD01'}}>&bull;</Text> &nbsp;&nbsp;{item.key}</Text>}
            />) 
          }
          </View>
          <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => navigation.navigate('home')}
              >
                  <LinearGradient
                      colors={['#01CD01', '#01CD01']}
                      style={styles.signIn}
                  >
                      <Text style={[styles.textSign, {
                          color:'#fff'
                      }]}>ADQUIRIR</Text>
                  </LinearGradient>
              </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>    

    );
  }

  console.log(data.client_data, "data del cliente");

  if (data.client_data !== null || data.client_data !== undefined || data.client_data !== '') {
    if (data.client_data !== null && data.client_data.subscribed == true) {
      return (
        <>
          <View style={{backgroundColor:'#303030', flex: 1}}>
            <View style={styles.top}>
              <Text style={styles.title_text}>Planes de suscripción</Text>
              <Text style={styles.title_text2}>PLAN ACTIVO</Text>
              <View style={styles.banner_suscription}>
                  <Text style={[styles.text_suscription, {textTransform: 'uppercase'}]}>dummy</Text>
              </View>
              <Text style={[styles.title_text, {marginTop: 25, marginBottom: 10}]}>SUGERENCIAS</Text>
            </View>
            <View style={styles.bot}>
            {data.data_plans != null ? 
              (
                <Carousel
                  pagination={PaginationLight}
                  renderItem={render}
                  data={data.data_plans}
                />
              ) : 
              (
                <View style={styles.container}>
                    <Text style={styles.title_text}>Cargando</Text>
                </View>
              )
            }
              
               
            </View>
          </View>
          <View>
            <Portal>
                  <StatusBar
                      barStyle={Platform.OS === true && theme.dark ? 'light-content' : 'light-content'}
                  />
                  <Dialog 
                      visible={visible} 
                      // onDismiss={() => setVisible(false)}
                      dismissable={false}
                      style={{borderRadius: 20, backgroundColor: 'rgba(0,0,0,0)'}}
                  >
                      <Dialog.ScrollArea>
                      <ScrollView contentContainerStyle={{paddingHorizontal: 24, marginTop: 50, marginBottom: 30, alignItems: 'center', backgroundColor: 'transparent'}}>
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
      )
    } else {
      return (
        <>
          <View style={{backgroundColor:'#303030', flex: 1}}>
            <View style={styles.top}>
              <Text style={styles.title_text}>Planes de suscripción</Text>
              <Text style={styles.title_text2}>NINGUNO</Text>
              <Text style={styles.title_text3}>SUGERENCIAS</Text>
            </View>
            <View style={styles.bot_2}>
              {data.data_plans != null ? 
                (
                  <Carousel
                    pagination={PaginationLight}
                    renderItem={_renderItem}
                    data={data.data_plans}
                  />
                ) : 
                (
                  <View style={styles.container}>
                      <Text style={styles.title_text}>Cargando</Text>
                  </View>
                )
              }
            </View>
          </View>
          <View>
            <Portal>
                  <StatusBar
                      barStyle={Platform.OS === true && theme.dark ? 'light-content' : 'light-content'}
                  />
                  <Dialog 
                      visible={visible} 
                      // onDismiss={() => setVisible(false)}
                      dismissable={false}
                      style={{borderRadius: 20, backgroundColor: 'rgba(0,0,0,0)'}}
                  >
                      <Dialog.ScrollArea>
                      <ScrollView contentContainerStyle={{paddingHorizontal: 24, marginTop: 50, marginBottom: 30, alignItems: 'center', backgroundColor: 'transparent'}}>
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
      )
    }
  } else {
    return(
        <View style={styles.container}>
            <Text style={styles.title_text}>Lo sentimos, no se obtuvo contenido</Text>
        </View>
    )
  }
  
}

export default PlansScreen



let widthScreen = Dimensions.get('window').width / 1.3
const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor:'#303030', 
    alignItems: 'center', 
    justifyContent: 'center', 
  }, 
  container_swapp: {
    textAlign: 'center', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  container_swapp2: {
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    width: 250, 
  },
  top: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
  },
  bot: {
    flex: 2.5, 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    width: '100%', 
  },
  bot_2: {
    flex: 4.5, 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    width: '100%', 
  },
  text_amount:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    marginTop: 30,
  },
  title_text:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    marginTop: 10
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
  bot_text:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    textAlign: 'center'
  },
  bot_text_alt:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40
  },
  bot_text2:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'left'
  },
  card:{
    // width: '100%',
    height: 220,
    width: widthScreen,
    // marginTop: 10,
    backgroundColor: '#282424',
    // borderRadius: 5
  },
  card_2:{
    // width: '100%',
    height: 370,
    width: widthScreen,
    // marginTop: 10,
    backgroundColor: '#282424',
    // borderRadius: 5
  },
  card_cover:{
      // marginLeft: 9, 
      // marginTop: 5, 
      // marginRight: 9, 
      // borderRadius: 5
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 20
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
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
  },
  banner_suscription: {
    backgroundColor: '#D4AF37', 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%', 
    marginTop: 5,
  },
  text_suscription: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
    color: '#fff'
  },
});