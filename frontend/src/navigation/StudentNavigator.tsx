import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StudentHomeScreen } from '../screens/StudentHomeScreen';
import { StudentProfileScreen } from '../screens/StudentProfileScreen';
import { StudentDemoProvider } from '../state/StudentDemoContext';
import { colors } from '../theme';
import type { StudentStackParamList } from './types';

const Stack = createNativeStackNavigator<StudentStackParamList>();

export function StudentNavigation() {
  return (
    <StudentDemoProvider>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'none',
      }}>
        <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
        <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
      </Stack.Navigator>
    </StudentDemoProvider>
  );
}
