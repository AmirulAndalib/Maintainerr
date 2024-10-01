export interface NotificationAgentConfig {
    enabled: boolean;
    types?: number[];
    options: Record<string, unknown>;
  }
  export interface NotificationAgentDiscord extends NotificationAgentConfig {
    options: {
      botUsername?: string;
      botAvatarUrl?: string;
      webhookUrl: string;
    };
  }
  
  export interface NotificationAgentSlack extends NotificationAgentConfig {
    options: {
      webhookUrl: string;
    };
  }
  
  export interface NotificationAgentEmail extends NotificationAgentConfig {
    options: {
      emailFrom: string;
      smtpHost: string;
      smtpPort: number;
      secure: boolean;
      ignoreTls: boolean;
      requireTls: boolean;
      authUser?: string;
      authPass?: string;
      allowSelfSigned: boolean;
      senderName: string;
      pgpPrivateKey?: string;
      pgpPassword?: string;
    };
  }
  
  export interface NotificationAgentLunaSea extends NotificationAgentConfig {
    options: {
      webhookUrl: string;
      profileName?: string;
    };
  }
  
  export interface NotificationAgentTelegram extends NotificationAgentConfig {
    options: {
      botUsername?: string;
      botAPI: string;
      chatId: string;
      sendSilently: boolean;
    };
  }
  
  export interface NotificationAgentPushbullet extends NotificationAgentConfig {
    options: {
      accessToken: string;
      channelTag?: string;
    };
  }
  
  export interface NotificationAgentPushover extends NotificationAgentConfig {
    options: {
      accessToken: string;
      userToken: string;
      sound: string;
    };
  }
  
  export interface NotificationAgentWebhook extends NotificationAgentConfig {
    options: {
      webhookUrl: string;
      jsonPayload: string;
      authHeader?: string;
    };
  }
  
  export interface NotificationAgentGotify extends NotificationAgentConfig {
    options: {
      url: string;
      token: string;
    };
  }
  
  export enum NotificationAgentKey {
    DISCORD = 'discord',
    EMAIL = 'email',
    GOTIFY = 'gotify',
    PUSHBULLET = 'pushbullet',
    PUSHOVER = 'pushover',
    SLACK = 'slack',
    TELEGRAM = 'telegram',
    WEBHOOK = 'webhook',
    WEBPUSH = 'webpush',
  }
  
  interface NotificationAgents {
    discord: NotificationAgentDiscord;
    email: NotificationAgentEmail;
    gotify: NotificationAgentGotify;
    lunasea: NotificationAgentLunaSea;
    pushbullet: NotificationAgentPushbullet;
    pushover: NotificationAgentPushover;
    slack: NotificationAgentSlack;
    telegram: NotificationAgentTelegram;
    webhook: NotificationAgentWebhook;
    webpush: NotificationAgentConfig;
  }
  
  interface NotificationSettings {
    agents: NotificationAgents;
  }