import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { Dimensions } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import React, { useState } from 'react';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  return (
    <SafeAreaView className={styles.background}>
      <View className={styles.loginContainer} style={{ height: height * 0.4, width: width * 0.9 }}>
        <Text className={styles.loginHeader}>Login</Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            setErrorMessage(''); // Clear error message on submit
            setShowPassword(false);
            setLoading(true);
            try {
              // Example API call using axios
              const response = await axios.post('http://192.168.1.226:5000/api/v1/users/login', {
                email: values.email,
                password: values.password,
              });

              // Handle successful response
              console.log('Login successful', response.data);

              // Perform any additional actions here, like navigation
            } catch (error) {
              if (axios.isAxiosError(error)) {
                console.error('Login failed:', error.response?.data, error);
                setErrorMessage(error.response?.data?.message || 'Login failed');
              } else {
                console.error('An unknown error occurred');
                setErrorMessage('An unknown error occurred'); // Set a generic error message
              }
            } finally {
              // Reset form or perform post-submit actions
              actions.setSubmitting(false); // Stop form loading state
              setLoading(false);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View className={styles.inputsContainer}>
              <TextInput
                className={styles.input}
                style={{ height: height * 0.05, width: width * 0.8 }}
                placeholder="Email"
                onChangeText={(text) => {
                  handleChange('email')(text);
                  setErrorMessage(''); // Clear error message on input change
                }}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text className={styles.error}>{errors.email}</Text>
              )}

              <View>
                <TextInput
                  className={styles.input}
                  style={{ height: height * 0.05, width: width * 0.8 }}
                  placeholder="Password"
                  secureTextEntry={!showPassword} // Control visibility
                  onChangeText={(text) => {
                    handleChange('password')(text);
                    setErrorMessage('');
                  }}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <Text className={styles.error}>{errors.password}</Text>
                )}
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text className={styles.showPasswordText}>
                    {showPassword ? 'Hide Password' : 'Show Password'}
                  </Text>
                </TouchableOpacity>
              </View>

              {errorMessage ? <Text className={styles.error}>{errorMessage}</Text> : null}
              <View
                className={styles.submitContainer}
                style={{ width: width * 0.6, height: height * 0.07 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" /> // Loading indicator
                ) : (
                  <Button
                    color={'white'}
                    title="Submit"
                    onPress={() => {
                      if (!loading) {
                        setErrorMessage(''); // clear errors only once
                        handleSubmit();
                      }
                    }}
                  />
                )}
              </View>
            </View>
          )}
        </Formik>
        <View
          className={styles.linksContainer}
          style={{ width: width * 0.8, height: height * 0.05 }}
        >
          <Link href="/" className={styles.linksText}>
            Signup
          </Link>
          <Link href="/" className={styles.linksText}>
            Forgot password?
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = {
  background: 'bg-[#151420] flex-1 justify-center items-center',
  loginContainer: `bg-[#191827] rounded-lg flex items-center`,
  loginHeader: `text-3xl font-bold mt-6 mb-3 text-[#edf1f3]`,
  inputsContainer: 'flex-1 justify-center p-4',
  input: `text-white border border-gray-500 rounded-3xl mb-4 px-6`,
  error: 'text-red-500',
  showPasswordText: 'text-white mt-2 text-right',
  submitContainer: `justify-center bg-[#151420] rounded-full mt-6 mx-auto`,
  linksContainer: `mb-2 flex-row justify-between items-center`,
  linksText: 'text-white',
};
