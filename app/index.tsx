import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getCurrentUser, isAuthenticated } from '../lib/auth';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const isAuth = await isAuthenticated();
        setAuthed(isAuth);

        if (isAuth) {
          const user = await getCurrentUser();
          setRole(user?.role || null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!authed) {
    return <Redirect href="/auth/signin" />;
  }

  if (role === 'manager') {
    return <Redirect href="/main/manager/dashboard" />;
  }

  // Default to student home for students or unknown roles
  return <Redirect href="/main/student/home" />;
}
