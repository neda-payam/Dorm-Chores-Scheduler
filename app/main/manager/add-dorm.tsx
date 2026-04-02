import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StyleSheet, Text, View } from 'react-native';

import Button from '../../../components/Button';
import HeaderBackButton from '../../../components/HeaderBackButton';
import InlineButton from '../../../components/InlineButton';
import Spacer from '../../../components/Spacer';
import { COLOURS } from '../../../constants/colours';

export default function AddDorm() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const headerGradientOpacity = useRef(new Animated.Value(1)).current; // Keep solid for this page since it doesn't scroll

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    // TODO: Verify the scanned QR code payload, link the dorm via API, then navigate
    console.log('Scanned data:', data);

    // Simulate an API delay before routing back to the dorms list
    setTimeout(() => {
      router.push('/main/manager/dorms');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_bottom' }}
      />

      {/* Header */}
      <View style={styles.topBar}>
        <HeaderBackButton iconName="times" />
      </View>

      <Animated.View
        style={[styles.headerGradientWrapper, { opacity: headerGradientOpacity }]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={['rgba(134, 134, 133, 0.35)', 'rgba(102, 102, 102, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.content}>
        <Text style={styles.heading}>Connect a Dorm</Text>
        <Spacer size="small" />
        <Text style={styles.subheading}>
          Scan the QR code on the resident&apos;s device to add their dorm to your managed list.
        </Text>

        <Spacer size="large" />

        {/* Camera & Permission States */}
        <View style={styles.cameraWrapper}>
          {!permission ? (
            <View style={styles.permissionContainer}>
              <Text style={[styles.subheading, { textAlign: 'center' }]}>
                Requesting camera permission...
              </Text>
            </View>
          ) : !permission.granted ? (
            <View style={styles.permissionContainer}>
              <Text style={styles.fieldLabel}>Camera Access Denied</Text>
              <Spacer size="small" />
              <Text style={[styles.subheading, { textAlign: 'center' }]}>
                We need access to your camera to scan dorm QR codes.
              </Text>
              <Spacer size="medium" />
              <Button title="Grant Permission" onPress={requestPermission} />
            </View>
          ) : (
            <View style={styles.scannerContainer}>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
              />
              {/* Overlay styling for the scanner */}
              <View style={styles.overlay}>
                <View style={styles.scanTarget} />
              </View>
            </View>
          )}
        </View>

        <Spacer size="large" />

        {scanned ? (
          <Text style={styles.successText}>QR Code scanned! Connecting...</Text>
        ) : (
          <Text style={styles.centerText}>
            Changed your mind? <InlineButton title="Go back" onPress={() => router.back()} />
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.white,
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOURS.white,
    zIndex: 10,
  },
  headerGradientWrapper: {
    height: 6,
    width: '100%',
    zIndex: 9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: COLOURS.black,
  },
  subheading: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: COLOURS.gray[500],
    lineHeight: 22,
  },
  fieldLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLOURS.black,
    textAlign: 'center',
  },
  cameraWrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: COLOURS.gray[100],
    maxHeight: 450,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  scanTarget: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: COLOURS.white,
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  successText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLOURS.black,
    textAlign: 'center',
  },
  centerText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.black,
    textAlign: 'center',
  },
});
