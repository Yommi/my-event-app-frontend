import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Formik } from 'formik';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';

export default function Index() {
  const [date, setDate] = useState<any>(new Date());

  const [currencyValue, setCurrencyValue] = useState(null);

  const currency = [
    { label: 'CAD', value: 'cad' },
    { label: 'USD', value: 'usd' },
    { label: 'EUR', value: 'eur' },
    { label: 'GBP', value: 'gbp' },
    { label: 'JPY', value: 'jpy' },
    { label: 'AUD', value: 'aud' },
    { label: 'INR', value: 'inr' },
  ];

  const dateChange = (e: any, selectedDate: any) => {
    setDate(selectedDate);
  };

  return (
    <SafeAreaView className=" flex-1 flex bg-[#151420]">
      <TouchableWithoutFeedback>
        <ScrollView className="mx-6">
          <View>
            <Text className="text-white text-4xl font-bold mt-4 mx-auto">
              Create Your Event
            </Text>
            <Formik
              initialValues={{ name: '', description: '', price: '' }}
              onSubmit={(values) => {
                console.log(values);
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
                <TouchableWithoutFeedback>
                  <View
                    id="form"
                    className="mt-6 px-4 py-6 flex justify-between bg-[#191827] rounded-xl"
                  >
                    <View id="field" className={styles.fieldContainer}>
                      <Text className={styles.fieldName}>Name</Text>
                      <TextInput
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        className={styles.fieldInput}
                      />
                    </View>

                    <View id="field" className={styles.fieldContainer}>
                      <Text className={styles.fieldName}>Description</Text>
                      <TextInput
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        value={values.description}
                        multiline={true}
                        style={{
                          height: height * 0.2,
                          textAlignVertical: 'top',
                        }}
                        className="mt-2 w-full rounded-xl p-3 text-white border border-white"
                      />
                    </View>

                    <View
                      id="field"
                      className="mb-6 flex flex-row justify-between"
                    >
                      <View>
                        <Text className={styles.fieldName}>Price</Text>
                        <TextInput
                          onChangeText={handleChange('price')}
                          onBlur={handleBlur('price')}
                          value={values.price}
                          style={{ width: width * 0.5 }}
                          className="mt-2 rounded-xl p-3 text-white border border-white"
                        />
                      </View>
                      <View>
                        <Text className={styles.fieldName}>Currency</Text>
                        <View className="flex bg-white rounded-lg">
                          <Dropdown
                            style={styles.dropdown}
                            data={currency}
                            labelField="label"
                            valueField="value"
                            placeholder=""
                            value={currencyValue}
                            onChange={(item: any) => {
                              setCurrencyValue(item.value);
                            }}
                            dropdownPosition="top"
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      id="field"
                      className="mb-6 flex flex-row justify-between"
                    >
                      <View>
                        <Text className={styles.fieldName}>Date</Text>
                        <DateTimePicker
                          value={date}
                          mode="date"
                          is24Hour={true}
                          onChange={dateChange}
                        />
                      </View>
                      <View>
                        <Text className={styles.fieldName}>Time</Text>
                        <DateTimePicker
                          value={date}
                          mode="time"
                          is24Hour={true}
                          onChange={dateChange}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </Formik>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {
  fieldContainer: 'mb-6',
  fieldName: 'text-white font-bold text-lg',
  fieldInput: 'mt-2 w-full rounded-xl p-3 text-white border border-white',
  dropdown: {
    height: 50,
    borderColor: 'white',
    paddingHorizontal: 8,
  },
};
