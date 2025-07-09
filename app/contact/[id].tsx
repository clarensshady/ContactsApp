import { contactsApi } from '@/services/api';
import { Contact } from '@/types/contact';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContact() {
      try {
        setLoading(true);
        setError(null);
        const data = await contactsApi.getContactById(Number(id));
        setContact(data);
      } catch (err) {
        setError('Failed to load contact details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadContact();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !contact) {
    return (
      <View style={styles.container}>
        {/* display error if there's an error or if there's no contact display the message */}
        <Text style={styles.errorText}>{error || 'Contact not found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: contact.name,
        }}
      />
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{contact.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{contact.email}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{contact.phone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  detailContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});