import axios from 'axios';
import {
  hasNotificationType,
  NotificationTypes,
} from '../notifications.service';
import type { NotificationAgent, NotificationPayload } from './agent';
import { Logger } from '@nestjs/common';
import { SettingsService } from '../../settings/settings.service';
import { NotificationAgentConfig } from '../notifications-interfaces';

class LunaSeaAgent implements NotificationAgent {
  public constructor(
    private readonly appSettings: SettingsService,
    private readonly settings: NotificationAgentConfig,
  ) {}
  private readonly logger = new Logger(LunaSeaAgent.name);

  getSettings = () => this.settings;

  private buildPayload(type: NotificationTypes, payload: NotificationPayload) {
    return {
      notification_type: NotificationTypes[type],
      event: payload.event,
      subject: payload.subject,
      message: payload.message,
      image: payload.image ?? null,
      email: this.getSettings().options.email,
      username: this.getSettings().options.displayName
        ? this.getSettings().options.profileName
        : this.getSettings().options.displayName,
      avatar: this.getSettings().options.avatar,
      extra: payload.extra ?? [],
    };
  }

  public shouldSend(): boolean {
    const settings = this.getSettings();

    if (settings.enabled && settings.options.webhookUrl) {
      return true;
    }

    return false;
  }

  public async send(
    type: NotificationTypes,
    payload: NotificationPayload,
  ): Promise<boolean> {
    const settings = this.getSettings();

    if (
      !payload.notifySystem ||
      !hasNotificationType(type, settings.types ?? [0])
    ) {
      return true;
    }

    this.logger.debug('Sending LunaSea notification', {
      label: 'Notifications',
      type: NotificationTypes[type],
      subject: payload.subject,
    });

    try {
      await axios.post(
        this.getSettings().options.webhookUrl as string,
        this.buildPayload(type, payload),
        settings.options.profileName
          ? {
              headers: {
                Authorization: `Basic ${Buffer.from(
                  `${settings.options.profileName}:`,
                ).toString('base64')}`,
              },
            }
          : undefined,
      );

      return true;
    } catch (e) {
      this.logger.error('Error sending LunaSea notification', {
        label: 'Notifications',
        type: NotificationTypes[type],
        subject: payload.subject,
        errorMessage: e.message,
        response: e.response?.data,
      });

      return false;
    }
  }
}

export default LunaSeaAgent;
