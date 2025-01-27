import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Banner = ({allData}) => {
    const navigation = useNavigation();
    console.log(allData.banner);

    if (allData) {
        return(
            <TouchableOpacity  onPress={() => navigation.navigate('Notifications')}>
                <View style={styles.card}>
                    <View style={styles.banner}>
                        <View style={styles.banner_background} /> 
                        <Image style={styles.card_img} source={{uri: allData.banner.image_url}} />
                        <View style={styles.banner_content}>
                            <Text style={styles.banner_text}>{allData.banner.titulo1} {allData.banner.titulo2}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
        
    }else{
        return null;
    }
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
        height: 336,
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
        width: 320, 
        height: 400,
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
