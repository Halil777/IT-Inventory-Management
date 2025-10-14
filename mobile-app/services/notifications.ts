import api from './api';
import { Notification } from '../interfaces/Notification';

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<Notification[]>('/notifications');
  return response.data;
};

