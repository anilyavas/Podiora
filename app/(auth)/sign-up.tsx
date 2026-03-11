import { useAuth, useOAuth, useSignUp } from '@clerk/expo';
import * as WebBrowser from 'expo-web-browser';
import { type Href, Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }
    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl('/');
          if (url.startsWith('http')) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      console.error('Sign-up attempt not complete:', signUp);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error('Google OAuth error:', err);
    }
  };

  const handleAppleAuth = async () => {
    try {
      const { createdSessionId, setActive } = await startAppleFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error('Apple OAuth error:', err);
    }
  };

  if (signUp.status === 'complete' || isSignedIn) return null;

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.inner}>
              <Text style={styles.logo}>
                Podi<Text style={styles.logoAccent}>ora</Text>
              </Text>
              <Text style={styles.title}>Check your email</Text>
              <Text style={styles.subtitle}>We sent a verification code to {emailAddress}</Text>
              <View style={styles.form}>
                <Text style={styles.label}>Verification code</Text>
                <TextInput
                  style={styles.input}
                  value={code}
                  placeholder="000000"
                  placeholderTextColor={Colors.textDim}
                  onChangeText={setCode}
                  keyboardType="numeric"
                />
                {errors.fields.code && (
                  <Text style={styles.error}>{errors.fields.code.message}</Text>
                )}
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    fetchStatus === 'fetching' && styles.buttonDisabled,
                  ]}
                  onPress={handleVerify}
                  disabled={fetchStatus === 'fetching'}>
                  <Text style={styles.buttonText}>
                    {fetchStatus === 'fetching' ? 'Verifying...' : 'Verify email'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => signUp.verifications.sendEmailCode()}
                  style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Resend code</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            {/* Branding */}
            <Text style={styles.logo}>
              Podi<Text style={styles.logoAccent}>ora</Text>
            </Text>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join Podiora and start listening</Text>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textDim}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
              />
              {errors.fields.emailAddress && (
                <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
              )}
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                placeholder="••••••••"
                placeholderTextColor={Colors.textDim}
                secureTextEntry
                onChangeText={setPassword}
              />
              {errors.fields.password && (
                <Text style={styles.error}>{errors.fields.password.message}</Text>
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  (!emailAddress || !password || fetchStatus === 'fetching') &&
                    styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!emailAddress || !password || fetchStatus === 'fetching'}>
                <Text style={styles.buttonText}>
                  {fetchStatus === 'fetching' ? 'Creating account...' : 'Create account'}
                </Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialColumn}>
              <Pressable
                style={({ pressed }) => [styles.socialButton, pressed && styles.buttonPressed]}
                onPress={handleGoogleAuth}>
                <Text style={styles.socialButtonText}>
                  {' '}
                  <AntDesign name="google" size={20} color={Colors.text} /> Continue with Google
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.socialButton, pressed && styles.buttonPressed]}
                onPress={handleAppleAuth}>
                <Text style={styles.socialButtonText}>
                  {' '}
                  <AntDesign name="apple" size={20} color={Colors.text} /> Continue with Apple
                </Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/sign-in">
                <Text style={styles.footerLink}>Sign in</Text>
              </Link>
            </View>

            {/* Required for Clerk bot protection */}
            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  logoAccent: {
    color: Colors.accent,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: Colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textDim,
    fontSize: 12,
    fontWeight: '500',
  },
  socialColumn: {
    gap: 15,
    marginTop: 4,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 16,
  },
  socialButtonText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
});
