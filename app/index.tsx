import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import React, { useState } from 'react';

export default function Index() {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  return (
    <View style={styles.background}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginHeader}>Login</Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            setErrorMessage(''); // Clear error message on submit
            setShowPassword(false);
            setLoading(true);
            try {
              // Example API call using axios
              const response = await axios.post(
                'http://192.168.1.226:5000/api/v1/users/login',
                {
                  email: values.email,
                  password: values.password,
                }
              );

              // Handle successful response
              console.log('Login successful', response.data);

              // Perform any additional actions here, like navigation
            } catch (error) {
              if (axios.isAxiosError(error)) {
                console.error(
                  'Login failed:',
                  error.response?.data,
                  error
                );
                setErrorMessage(
                  error.response?.data?.message || 'Login failed'
                );
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
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.inputsContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => {
                  handleChange('email')(text);
                  setErrorMessage(''); // Clear error message on input change
                }}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <View>
                <TextInput
                  style={styles.input}
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
                  <Text style={styles.error}>{errors.password}</Text>
                )}
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showPasswordText}>
                    {showPassword ? 'Hide Password' : 'Show Password'}
                  </Text>
                </TouchableOpacity>
              </View>

              {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
              ) : null}
              <View style={styles.submitContainer}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" /> // Loading indicator
                ) : (
                  <Button
                    color={'white'}
                    title="Submit"
                    onPress={() => {
                      handleSubmit();
                      setErrorMessage('');
                    }}
                  />
                )}
              </View>
            </View>
          )}
        </Formik>
        <View style={styles.linksContainer}>
          <Link href="/" style={styles.linksText}>
            Signup
          </Link>
          <Link href="/" style={styles.linksText}>
            Forgot password?
          </Link>
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#151420',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    height: height * 0.4,
    width: width * 0.9,
    backgroundColor: '#191827',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
  loginHeader: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginTop: height * 0.02,
    color: '#edf1f3',
  },
  inputsContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: height * 0.05,
    width: width * 0.8,
    color: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  submitContainer: {
    width: width * 0.6,
    height: height * 0.07,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#151420',
    borderRadius: 50,
    marginHorizontal: 'auto',
    marginTop: height * 0.02,
  },
  error: {
    color: 'red',
  },
  linksContainer: {
    width: width * 0.8,
    height: height * 0.05,
    marginBottom: height * 0.01,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linksText: {
    color: 'white',
  },
  showPasswordText: {
    color: 'white',
    marginTop: 10,
    textAlign: 'right',
  },
});
