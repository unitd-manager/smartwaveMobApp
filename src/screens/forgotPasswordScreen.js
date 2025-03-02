import React, { useLayoutEffect } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  ScrollView,
  I18nManager,
  Keyboard,
  Platform,
  Alert
} from "react-native"
import { connect } from "react-redux"
import Icon from "react-native-vector-icons/FontAwesome"
import Ionicons from "react-native-vector-icons/Ionicons"
import CustomBtn from "../components/customBtn"
import { TouchableOpacity } from "react-native-gesture-handler"
import { WIDTH } from "../components/config"
import RNRestart from "react-native-restart"
import AsyncStorage from "@react-native-async-storage/async-storage"
import api from "../constants/api"

const LoginScreen = ({ navigation, theme, reduxLang }) => {
  // Header Settings
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: reduxLang.ForgetPassword,
      headerStyle: {
        backgroundColor: theme.secondryBackgroundColor,
        shadowColor: "transparent"
      },
      headerTintColor: theme.textColor
    })
  }, [
    navigation,
    reduxLang.Login,
    theme.secondryBackgroundColor,
    theme.textColor
  ])

  const [checkBox, onChangeCheckBox] = React.useState(false)
  const [name, onChangeName] = React.useState("")
  const [pass, onChangePass] = React.useState("")
  const [passShown, onChangePassShown] = React.useState(false)
  let secondTextInput = ""

  const onPressSignWithPasswords = async () => {
    api
      .post("/api/login", {
        email: name,
        password: pass
      })
      .then(async res => {
        console.log(res.data.data)
        if (res && res.data.msg === "Success") {
          await AsyncStorage.setItem("USER_TOKEN", "loggedin")
          await AsyncStorage.setItem("USER", JSON.stringify(res.data.data))
          // signIn('124')
          
          Alert.alert("Success")
          RNRestart.Restart()
          navigation.navigate('Home');
        } else {
          console.log("Invalid Credentials")
          Alert.alert("Invalid ")
        }
      })
      .catch(() => {
        Alert.alert("Invalid Credentials")
      })
  }
  const onPressSignWithPassword = async () => {
    api.post('/contact/forgotPass', {
        email: name,
    }).then(async (res) => {
        SendEmail(res.data.data);
    }).catch(() => {
        Alert.alert('Please verify the email address and try again.')
    })
};


const SendEmail = (emailData) => {

    const to = emailData[0].email;
    const subject = "Password";
    const password = emailData[0].pass_word;

    api
        .post('/commonApi/sendUseremailForgetPassword', {
            to,
            subject,
            password,
        })
        .then(response => {
            if (response.status === 200) {
                Alert.alert('Password Sent successfully on your mail.');
                navigation.push("Login")
            } else {
                console.error('Error');
            }
        });
};
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.primaryBackgroundColor }
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          justifyContent: "center"
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          resizeMode={"cover"}
          style={[styles.drawerImageStyle]}
          source={require("../images/maleAvatar.png")}
        />

        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.secondryBackgroundColor,
              color: theme.textColor,
              fontSize: theme.appFontSize.mediumSize,
              fontFamily: theme.appFontSize.fontFamily,
              padding: Platform.OS === "android" ? "2%" : "2.6%",
              paddingLeft: "4%"
            }
          ]}
          onChangeText={text => onChangeName(text)}
          placeholder={'Enter Your Email'}
          placeholderTextColor={"gray"}
          value={name}
          onSubmitEditing={() => {
            secondTextInput.focus()
          }}
          blurOnSubmit={false}
        />

  
        <View style={styles.forgotRow}>
          <View style={styles.rememberMeVIew}>
          
          </View>

        </View>
        <CustomBtn
          onPressFun={() => {
            onPressSignWithPassword()
          }}
          theme={theme}
          title={'Send To Mail'}
        ></CustomBtn>

      
        <View style={styles.signUpContainer}>
          <Text
            style={{
              color: theme.textColor,
              fontSize: theme.appFontSize.smallSize,
              fontFamily: theme.appFontSize.fontFamily
            }}
          >
            {'Back to Sign In ? '}
          </Text>
          <TouchableOpacity onPress={() => navigation.push("Login")}>
            <Text
              style={[
                styles.signUpText,
                {
                  color: theme.primary,
                  fontSize: theme.appFontSize.mediumSize,
                  fontFamily: theme.appFontSize.fontFamily
                }
              ]}
            >
              {'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  backIcon: {
    padding: "4%",
    paddingBottom: "3%",
    paddingTop: "5%",
    alignSelf: "flex-start"
  },
  socialIcon: {
    color: "#ffffff"
  },
  forgotPassText: {
    paddingLeft: "1%",
    paddingRight: "1%",
    paddingBottom: "0.2%"
  },
  deviderStyleView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "10%",
    marginBottom: "10%",
    width: "60%",
    alignSelf: "center"
  },
  deviderInnerView: {
    flex: 1,
    height: 1,
    backgroundColor: "#D2D2D2"
  },
  deviderText: {
    color: "#D2D2D2",
    width: 50,
    textAlign: "center"
  },
  passContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "92%",
    alignSelf: "center",
    margin: "1%",
    borderRadius: 10
  },
  forgotText: {
    alignSelf: "flex-end",
    padding: "3%",
    paddingTop: "1%",
    paddingBottom: "5%"
  },
  drawerImageStyle: {
    backgroundColor: "transparent",
    height: WIDTH * 0.2,
    width: WIDTH * 0.2,
    margin: 10,
    alignSelf: "center",
    marginTop: "10%",
    marginBottom: "7%"
  },
  nameText: {
    textAlign: "center",
    fontWeight: "700"
  },
  textInput: {
    borderColor: "gray",
    width: "93%",
    padding: Platform.OS === "android" ? "1%" : "1.6%",
    paddingLeft: "4%",
    borderRadius: 10,
    marginTop: "1%",
    marginBottom: "1.4%",
    textAlign: I18nManager.isRTL ? "right" : "left",
    alignSelf: "center"
  },
  scrollView: {
    flex: 1
  },
  socialIconContainer: {
    height: WIDTH * 0.14,
    width: WIDTH * 0.14,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: WIDTH * 0.14
  },
  forgotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "3.5%",
    paddingTop: "2%",
    paddingBottom: "8%"
  },
  rememberMeVIew: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  signInBtnsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: "10%"
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop:"10%",
    marginBottom: "10%",
    alignItems: "center",
    justifyContent: "center"
  },
  signUpText: {
    paddingLeft: "1%",
    paddingRight: "1%",
    paddingBottom: "0.2%"
  }
})

const mapStateToProps = state => ({
  theme: state.configReducer.theme,
  reduxLang: state.configReducer.lang
})

export default connect(mapStateToProps, null)(LoginScreen)
