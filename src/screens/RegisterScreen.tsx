// src/screens/RegisterScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { registerWithEmail } from '../core/auth';
import { RootStackParamList } from '../navigation/AppNavigator'; // Import the type

// ‫تحديد نوع الخصائص (props) لهذه الشاشة من الملاح
type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * ‫دالة لمعالجة عملية إنشاء حساب جديد
   */
  const handleRegister = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("خطأ", "الرجاء إدخال بريد إلكتروني صالح.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("خطأ", "يجب أن تكون كلمة المرور 8 أحرف على الأقل.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerWithEmail(email, password);
      // ‫بعد التسجيل الناجح، onAuthStateChanged في AppNavigator سيتولى الانتقال
      // We don't need to navigate manually. The listener in AppNavigator will do the work.
    } catch (e: any) {
      let errorMessage = "حدث خطأ أثناء إنشاء الحساب.";
      if (e.code === 'auth/email-already-in-use') {
        errorMessage = "هذا البريد الإلكتروني مستخدم بالفعل.";
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = "البريد الإلكتروني غير صالح.";
      } else if (e.code === 'auth/weak-password') {
        errorMessage = "كلمة المرور ضعيفة جدًا.";
      }
      setError(errorMessage);
      console.error("Registration Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إنشاء حساب جديد</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="كلمة السر (6 أحرف على الأقل)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="إنشاء حساب" onPress={handleRegister} />
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
            <Text style={styles.linkText}>لديك حساب بالفعل؟ تسجيل الدخول</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 15,
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default RegisterScreen;
