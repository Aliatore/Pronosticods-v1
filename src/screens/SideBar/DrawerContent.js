import React from 'react';
import { View, StyleSheet } from 'react-native';
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

import{ AuthContext } from '../../components/context';

export function DrawerContent(props) {

    const paperTheme = useTheme();

    const { signOut, toggleTheme } = React.useContext(AuthContext);

    return(
        <View style={{flex:1, backgroundColor: '#303030'}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    {/* <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>John Doe</Title>
                            </View>
                        </View>
                        
                    </View> */}

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="menu" 
                                color={'#01CD01'}
                                size={size}
                                />
                            )}
                            label="John Doe"
                            activeTintColor="#fff"
                            inactiveTintColor="#fff"
                            onPress={() => {props.navigation.closeDrawer()}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color={'#fff'}
                                size={size}
                                />
                            )}
                            label="Cambiar contraseña"
                            activeTintColor="#fff"
                            inactiveTintColor="#fff"
                            onPress={() => {props.navigation.navigate('Home')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={'#fff'}
                                size={size}
                                />
                            )}
                            label="Editar perfil"
                            activeTintColor="#fff"
                            inactiveTintColor="#fff"
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="exit-to-app" 
                                color={'#fff'}
                                size={size}
                                />
                            )}
                            label="Cerrar sesión"
                            activeTintColor="#fff"
                            inactiveTintColor="#fff"
                            onPress={() => {signOut()}}
                        />
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Feather 
                                name="settings" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {props.navigation.navigate('SettingsScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-check-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Support"
                            onPress={() => {props.navigation.navigate('SupportScreen')}}
                        /> */}
                    </Drawer.Section>
                    {/* <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
                </View>
            </DrawerContentScrollView>
            {/* <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {signOut()}}
                />
            </Drawer.Section> */}
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
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
