import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputText from '../components/input/inputText';
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
const logo = require('../../assets/Figma/Logo_Text.png');
export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logoImage} />
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Sign In</Text>
        <View style={{ margin: 20 }}>
          <InputText
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text:string) => setEmail(text)}
            secure={false}
            iconLeft="email"
            iconRight="eye-off"
            onRightPress={() => console.log('Right icon pressed')}
          />
          <InputText
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text:string) => setPassword(text)}
            secure={true}
            iconLeft="lock"
            iconRight="eye-off"
            onRightPress={() => console.log('Right icon pressed')}
          />
          <Button title="Sign In" onPress={() => navigation.navigate('Main')} />
        </View>
      </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 3, alignItems: 'center', },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    maxWidth: 300,
    height: '100%',
    maxHeight: 300,
  },
  text: { fontSize: 20, marginBottom: 10, fontWeight: '800',  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});