import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';
import { PlatformType } from '../types';

export async function openPlatformLink(
  platform: PlatformType,
  appScheme: string,
  webUrl: string,
  restaurantName: string
): Promise<boolean> {
  try {
    if (Platform.OS !== 'web') {
      const canOpen = await Linking.canOpenURL(appScheme).catch(() => false);
      if (canOpen) {
        await Linking.openURL(appScheme);
        return true;
      }
    }
    
    // Fallback to official web URL
    const canOpenWeb = await Linking.canOpenURL(webUrl).catch(() => false);
    if (canOpenWeb) {
      await Linking.openURL(webUrl);
      return true;
    } else {
      // Direct open
      await Linking.openURL(webUrl);
      return true;
    }
  } catch (err) {
    Alert.alert(
      'Could not open link',
      `Unable to redirect to ${restaurantName}. Please visit the official ${platform.replace('_', ' ')} website.`
    );
    return false;
  }
}
