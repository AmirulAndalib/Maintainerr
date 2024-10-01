import type { NotificationTypes } from '../notifications.service';

export interface NotificationPayload {
  event?: string;
  subject: string;
  notifySystem: boolean;
  image?: string;
  message?: string;
  extra?: { name: string; value: string }[];
}

export interface NotificationAgent {
  shouldSend(): boolean;
  send(type: NotificationTypes, payload: NotificationPayload): Promise<boolean>;
}
