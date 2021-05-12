import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';

import{ AuthContext } from '../../components/context';

export function DrawerContent(props) {

    const paperTheme = useTheme();

    const { signOut, toggleTheme } = React.useContext(AuthContext);

    const [data, setData] = React.useState({
        client_token: '',
        data_user: null,
        error_message: '',
        date_today: ''
      });

    
      //obtain the token with asyncstorage and set in state data.
    const obtainToken = async () => {
      try {
          const value = await AsyncStorage.getItem('dataUser');
          const valueParsed = JSON.parse(value);
          setClientData(valueParsed)
      } catch(e) {
          console.log(e);
      }
    }
    
    const setClientData = (e) => {
      setData({
          ...data,
          data_user: e
      }); 
    }

    React.useEffect(() => {
        obtainToken()
    }, []);

    return(
        <View style={{flex:1, backgroundColor: '#292828'}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.globalDrawerContent}>
                    <View style={styles.drawerContent1}>
                        <Drawer.Section style={styles.drawerSection}>
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="menu" 
                                    color={'#01CD01'}
                                    size={size}
                                    />
                                )}  
                                label=""
                                activeTintColor="#fff"
                                inactiveTintColor="#fff"
                                onPress={() => {props.navigation.closeDrawer()}}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="shield-half-full" 
                                    color={'#fff'}
                                    size={size}
                                    />
                                )}
                                label=""
                                activeTintColor="#fff"
                                inactiveTintColor="#fff"
                                onPress={() => {props.navigation.navigate('RestorePasswordScreen')}}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="square-edit-outline" 
                                    color={'#fff'}
                                    size={size}
                                    />
                                )}
                                label=""
                                activeTintColor="#fff"
                                inactiveTintColor="#fff"
                                onPress={() => {props.navigation.navigate('EditProfileScreen')}}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="logout-variant" 
                                    color={'#fff'}
                                    size={size}
                                    />
                                )}
                                label=""
                                activeTintColor="#fff"
                                inactiveTintColor="#fff"
                                
                            />
                        </Drawer.Section>
                    </View>
                    <View style={styles.drawerContent}>
                        <Drawer.Section style={styles.drawerSection}>
                            <DrawerItem 
                                label={data.data_user !== null ? data.data_user.first_name : ""}
                                activeTintColor="#fff"
                                inactiveTintColor="#fff"
                                // onPress={() => {props.navigation.closeDrawer()}}
                            />
                            <DrawerItem 
                                label="Cambiar contraseña"
                                activeTintColor="#fff"
                                inactiveTintColor="#fff"
                                onPress={() => {props.navigation.navigate('RestorePasswordScreen')}}
                            />
                            <DrawerItem 
                                label="Editar perfil"
                                activeTintColor="#fff"
                                inactiveTintColor="#fff"
                                onPress={() => {props.navigation.navigate('EditProfileScreen')}}
                            />
                            <DrawerItem 
                                label="Cerrar sesión"
                                activeTintColor="#fff"
                                inactiveTintColor="#fff"
                                onPress={() => {signOut()}}
                            />
                        </Drawer.Section>
                    </View>        
                </View>
            </DrawerContentScrollView>
        </View>
    );
}
let heightScreen = Dimensions.get('window').height 
const styles = StyleSheet.create({
    globalDrawerContent: {
      flex: 1,
      flexDirection: 'row',
      marginTop: -5,
      height: heightScreen,
    },
    drawerContent: {
      flex: 1,
      backgroundColor: '#292828',
    },
    drawerContent1: {
      flex: 0.28,
      backgroundColor: '#171717',
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
