// src/navigation/AppNavigator.tsx

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RoomScreen from '../screens/RoomScreen';

// ‫تحديد أنواع الشاشات والبارامترات الخاصة بها
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Profile: { userId: string };
  Room: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // ‫حالة لتتبع المستخدم المسجل دخوله
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // ‫مستمع لمراقبة تغييرات حالة المصادقة
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // ‫عرض شاشة تحميل أثناء التحقق من حالة المستخدم
  if (initializing) {
    return null; // Or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // If the user is logged in, show the main app screens
          <>
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'الملف الشخصي' }}
              initialParams={{ userId: user.uid }}
            />
            <Stack.Screen
              name="Room"
              component={RoomScreen}
              options={{ title: 'غرفة الدردشة' }}
            />
          </>
        ) : (
          // ‫إذا لم يكن المستخدم مسجل الدخول، اعرض شاشات المصادقة
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'تسجيل الدخول', headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'إنشاء حساب', headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
