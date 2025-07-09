import { contactsApi } from '@/services/api';
import { Contact } from '@/types/contact';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactsApi.getContacts();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError('Failed to load contacts data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(text.toLowerCase()) ||
        contact.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [contacts]);

// this function will renrender only after the component is mounted
  const renderItem = useCallback(
    ({ item }: { item: Contact }) => (
      <View
        style={styles.contactItem}
        onTouchEnd={() => router.push(`/contact/${item.id}`)}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
      </View>
    ),
    [router]
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Contacts' }} />
      <TextInput
        style={
          styles.searchInput
        }
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search contacts..."

      />
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlashList
          data={filteredContacts}
          renderItem={renderItem}
          estimatedItemSize={70}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  contactItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});