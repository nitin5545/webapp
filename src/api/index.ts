import axios from 'axios';
import { Item } from '../types/index';

const API_URL = 'http://localhost:5450/api';

export const fetchItems = async (): Promise<Item[]> => {
  try {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const createItem = async (item: Item) => {
  try {
    await axios.post(`${API_URL}/items`, item);
  } catch (error) {
    console.error('Error creating item:', error);
  }
};

export const updateItem = async (item: Item) => {
  try {
    await axios.put(`${API_URL}/items/${item.id}`, item);
  } catch (error) {
    console.error('Error updating item:', error);
  }
};

export const deleteItem = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/items/${id}`);
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

export const updateItems = async (items: Item[]) => {
  try {
    const reorderedItems = items.map((item, index) => {
      return {
        ...item, order : index
      }});
    await axios.put(`${API_URL}/items/updateItems`, reorderedItems);
  } catch (error) {
    console.error('Error reordering items:', error);
  }
};