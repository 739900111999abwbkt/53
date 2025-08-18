// src/screens/ProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { signOut } from '../core/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  // We need to define the type for the user state
  const [user, setUser] = useState<{ displayName: string; email: string | null } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  // ‫مراقبة حالة المصادقة للحصول على بيانات المستخدم
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // ‫المستخدم مسجل دخوله
        setUser({
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'مستخدم',
          email: firebaseUser.email,
        });
      } else {
        // ‫المستخدم قام بتسجيل الخروج
        setUser(null);
        // In a real app, you would navigate back to the Login screen here.
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  /**
   * ‫دالة لمعالجة تسجيل الخروج
   */
  const handleLogout = () => {
    Alert.alert(
      "تأكيد تسجيل الخروج",
      "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      [
        {
          text: "إلغاء",
          style: "cancel"
        },
        {
          text: "تسجيل الخروج",
          onPress: async () => {
            setLoggingOut(true);
            try {
              await signOut();
              // onAuthStateChanged will handle navigation
            } catch (error) {
              console.error("Logout Error:", error);
              Alert.alert("خطأ", "حدث خطأ أثناء تسجيل الخروج.");
            } finally {
              setLoggingOut(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  /**
   * ‫دالة لمعالجة تغيير كلمة المرور
   */
  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      Alert.alert("خطأ", "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    const currentUser = auth().currentUser;
    if (currentUser) {
      currentUser.updatePassword(newPassword)
        .then(() => {
          Alert.alert("نجاح", "تم تغيير كلمة المرور بنجاح.");
          setNewPassword('');
        })
        .catch((error) => {
          console.error("Change Password Error:", error);
          // This operation is sensitive and requires recent authentication.
          Alert.alert("خطأ", "فشل تغيير كلمة المرور. قد تحتاج إلى تسجيل الدخول مرة أخرى لإتمام هذه العملية.");
        });
    }
  };

  if (!user) {
    // ‫في تطبيق حقيقي، قد تعرض شاشة تحميل هنا أو يتم توجيهك إلى شاشة تسجيل الدخول
    return (
      <View style={styles.container}>
        <Text style={styles.info}>لم يتم تسجيل الدخول</Text>
        {/* You could add a button here to navigate to the Login screen */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>الملف الشخصي</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>الاسم:</Text>
        <Text style={styles.info}>{user.displayName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>البريد الإلكتروني:</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>

      {/* قسم تغيير كلمة المرور */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>تغيير كلمة المرور</Text>
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور الجديدة"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Button title="تحديث كلمة المرور" onPress={handleChangePassword} />
      </View>

      {/* قسم الدردشة الصوتية */}
      <View style={styles.section}>
        <Button
          title="دخول غرفة الدردشة"
          onPress={() => navigation.navigate('Room')}
        />
        <View style={{ marginTop: 10 }}>
          <Button
            title="بدء الكاريوكي"
            onPress={() => navigation.navigate('Karaoke')}
            color="#9b59b6"
          />
        </View>
      </View>

      {/* زر تسجيل الخروج */}
      <View style={styles.logoutButton}>
        {loggingOut ? (
          <ActivityIndicator size="large" color="#c0392b" />
        ) : (
          <Button title="تسجيل الخروج" onPress={handleLogout} color="#c0392b" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    width: 120,
  },
  info: {
    fontSize: 18,
    color: '#333',
    flexShrink: 1,
  },
  section: {
    width: '100%',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
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
  logoutButton: {
    marginTop: 'auto',
    width: '100%',
    paddingTop: 20,
  }
});

export default ProfileScreen;
