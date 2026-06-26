export const NotificationService = {
  isSupported: (): boolean => 'Notification' in window,

  getPermission: (): NotificationPermission =>
    NotificationService.isSupported() ? Notification.permission : 'denied',

  requestPermission: async (): Promise<NotificationPermission> => {
    if (!NotificationService.isSupported()) return 'denied';
    if (Notification.permission !== 'default') return Notification.permission;
    return Notification.requestPermission();
  },

  send: (title: string, body: string, tag?: string): void => {
    if (!NotificationService.isSupported() || Notification.permission !== 'granted') return;
    new Notification(title, {
      body,
      tag: tag ?? `fiberops-${Date.now()}`,
    });
  },
};
