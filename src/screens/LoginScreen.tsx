// src/screens/LoginScreen.tsx

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
import { signInWithEmail, sendPasswordResetEmail } from '../core/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  // ‫حالات لتخزين مدخلات المستخدم، حالة التحميل، والأخطاء
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * ‫دالة لمعالجة عملية تسجيل الدخول
   */
  const handleLogin = async () => {
    // ‫التحقق من صحة البريد الإلكتروني وكلمة المرور
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
      // ‫استدعاء دالة تسجيل الدخول من خدمة Firebase
      await signInWithEmail(email, password);
      // ‫ملاحظة: في تطبيق حقيقي، سيتم هنا الانتقال إلى شاشة أخرى (مثل الملف الشخصي)
      Alert.alert("نجاح", "تم تسجيل الدخول بنجاح!");
    } catch (e: any) {
      // ‫معالجة وعرض أخطاء Firebase
      let errorMessage = "حدث خطأ غير متوقع.";
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = "البريد الإلكتروني غير صالح.";
      }
      setError(errorMessage);
      console.error("Login Error:", e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ‫دالة لمعالجة طلب إعادة تعيين كلمة المرور
   */
  const handlePasswordReset = async () => {
    if (!email.includes('@')) {
      Alert.alert("خطأ", "الرجاء إدخال بريدك الإلكتروني في الحقل المخصص أولاً.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(email);
      Alert.alert("تحقق من بريدك", "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
    } catch (e: any) {
      let errorMessage = "فشل إرسال البريد الإلكتروني لإعادة التعيين.";
       if (e.code === 'auth/user-not-found') {
        errorMessage = "لا يوجد حساب مرتبط بهذا البريد الإلكتروني.";
      }
      setError(errorMessage);
      console.error("Password Reset Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>

      {/* عرض رسالة الخطأ إذا وجدت */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* حقل إدخال البريد الإلكتروني */}
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* حقل إدخال كلمة السر */}
      <TextInput
        style={styles.input}
        placeholder="كلمة السر"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* عرض مؤشر التحميل أو زر تسجيل الدخول */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="تسجيل الدخول" onPress={handleLogin} />
          <TouchableOpacity onPress={handlePasswordReset} style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>نسيت كلمة السر؟</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>ليس لديك حساب؟ إنشاء حساب جديد</Text>
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
  forgotPasswordButton: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 16,
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
