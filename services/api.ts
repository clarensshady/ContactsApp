import axios from 'axios';
import { Contact } from '@/types/contact';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const contactsApi = {
  getContacts: async (): Promise<Contact[]> => {
    try {
      const response = await api.get<Contact[]>('/users');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch contacts: ${error.message}`);
      }
      throw error;
    }
  },

  getContactById: async (id: number): Promise<Contact> => {
    try {
      const response = await api.get<Contact>(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch contact: ${error.message}`);
      }
      throw error;
    }
  },
};