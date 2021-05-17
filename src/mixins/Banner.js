import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Linking} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';

const Banner = () => {

    // console.log(dataNews);

    return(
        <View style={styles.card}>
            <View style={styles.banner}>
                <View style={styles.banner_background} />
                <Image style={styles.card_img} source={require('../assets/img/png/LeBron.png')} />
                <View style={styles.banner_content}>
                    <Text style={styles.banner_text}>Unete a nuestros planes especiales</Text>
                </View>
            </View>
        </View>
    )
}

export default Banner;
let widthScreen = Dimensions.get('window').width / 1.04;
const styles = StyleSheet.create({
    card:{
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
        width: widthScreen,
        marginTop: 20,
        borderRadius: 5,
        position: 'relative',
        display: 'flex',
        textAlign: 'center',
    },
    banner_content: {
        height: 100,
        width: widthScreen,
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
        zIndex: 3,
        top: 175
    },
    banner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    banner_background: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: '#079307',
        borderRadius: 5,
        position: 'absolute',
        zIndex: 1,
        height: 335,
        width: widthScreen,
        top: 55,
    },
    banner_text: {
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        fontWeight: 'bold'
    },
    card_img:{
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
    },
    card_cover:{
        marginLeft: 25, 
        marginTop: 15, 
        marginRight: 25, 
        borderRadius: 5
    },
    title_text:{
        color: '#01CD01',
        fontFamily: 'Montserrat-Regular',
        fontSize: 20,
        marginTop: 20,
        marginLeft: 10
    },
    paragraph_white:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        marginTop: 2,
        marginLeft: 10,
        marginBottom: 18
    },
    paragraph_grey:{
        color: '#8e8e8e',
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
    },
})
