// ============================================================
// 🌾 NammaVivasayam AI — Notification Center
// Contextual in-app notifications
// ============================================================

import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../i18n';

interface Notification {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'recommendation' | 'risk' | 'weather' | 'service' | 'system';
}

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 'n1', icon: '💧', title: 'Irrigation Recommendation', message: 'Don\'t irrigate today. Rain expected.', time: '2 hours ago', isRead: false, type: 'recommendation' },
  { id: 'n2', icon: '🌧️', title: 'Weather Alert', message: '68% rain probability this evening.', time: '3 hours ago', isRead: false, type: 'weather' },
  { id: 'n3', icon: '🌡️', title: 'Heat Warning', message: 'Temperature at 34°C near stress threshold.', time: '5 hours ago', isRead: true, type: 'risk' },
  { id: 'n4', icon: '🚜', title: 'Service Available', message: 'Combine harvester available in your area.', time: '1 day ago', isRead: true, type: 'service' },
  { id: 'n5', icon: '🌾', title: 'Crop Stage Update', message: 'Your paddy has entered flowering stage.', time: '2 days ago', isRead: true, type: 'system' },
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  useApp();
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="bottom-sheet">
        <div className="bottom-sheet__handle" />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
            🔔 {t('common.notifications')}
            {unreadCount > 0 && (
              <span style={{ marginLeft: 'var(--space-2)', background: 'var(--color-error)', color: '#fff', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)' }}>
                {unreadCount}
              </span>
            )}
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {unreadCount > 0 && (
              <button className="btn btn--ghost btn--sm" onClick={markAllRead}>
                {t('common.markAllRead')}
              </button>
            )}
            <button className="btn btn--ghost" onClick={onClose} style={{ fontSize: 'var(--text-xl)' }}>✕</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {notifications.map(notif => (
            <div
              key={notif.id}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
                background: notif.isRead ? 'transparent' : 'var(--color-paddy-50)',
                border: `1px solid ${notif.isRead ? 'var(--color-border-light)' : 'var(--color-paddy-200)'}`,
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{ fontSize: 'var(--text-xl)', lineHeight: 1 }}>{notif.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: notif.isRead ? 400 : 600 }}>{notif.title}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{notif.message}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>{notif.time}</div>
              </div>
              {!notif.isRead && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-paddy)', flexShrink: 0, marginTop: '6px' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
