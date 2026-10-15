import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  ShieldAlert,
  Compass,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { AppNotification } from '../types';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    unreadNotificationsCount,
  } = useSafety();

  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'sos') return n.type === 'sos_alert';
    if (filterType === 'journey') return n.type === 'journey_reminder';
    return true;
  });

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'sos_alert':
        return <ShieldAlert className="w-5 h-5 text-[#D92D45]" />;
      case 'journey_reminder':
        return <Compass className="w-5 h-5 text-[#7651A8]" />;
      case 'incident_update':
        return <AlertTriangle className="w-5 h-5 text-[#247A55]" />;
      default:
        return <Info className="w-5 h-5 text-[#4A245E]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#25212B] tracking-tight">Notification Center</h1>
            {unreadNotificationsCount > 0 && (
              <span className="text-xs font-bold text-white bg-[#D92D45] px-2 py-0.5 rounded-full">
                {unreadNotificationsCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Real-time logs of emergency broadcasts, check-in pings, and community alerts.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#4A245E] bg-[#F1EAF8] hover:bg-[#e4d4f2] rounded-xl transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 border border-[#E9E5EE] rounded-2xl text-xs font-bold w-fit">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            filterType === 'all' ? 'bg-[#4A245E] text-white' : 'text-[#77717F] hover:text-[#25212B]'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            filterType === 'unread' ? 'bg-[#4A245E] text-white' : 'text-[#77717F] hover:text-[#25212B]'
          }`}
        >
          Unread ({unreadNotificationsCount})
        </button>
        <button
          onClick={() => setFilterType('sos')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            filterType === 'sos' ? 'bg-[#4A245E] text-white' : 'text-[#77717F] hover:text-[#25212B]'
          }`}
        >
          SOS Alerts
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#E9E5EE] text-center space-y-2">
            <Bell className="w-10 h-10 text-[#77717F] mx-auto opacity-40" />
            <p className="text-sm font-bold text-[#25212B]">No notifications in this filter</p>
            <p className="text-xs text-[#77717F]">You are completely up to date.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                item.read
                  ? 'bg-white border-[#E9E5EE]'
                  : 'bg-[#FAF9FC] border-[#7651A8] shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-[#E9E5EE] shrink-0 mt-0.5 shadow-xs">
                  {getIcon(item.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#25212B]">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#7651A8]" />
                    )}
                  </div>
                  <p className="text-xs text-[#77717F] leading-relaxed">{item.message}</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-[#77717F]">
                    <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>·</span>
                    <span>{new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    {item.actionUrl && (
                      <>
                        <span>·</span>
                        <Link
                          to={item.actionUrl}
                          className="font-bold text-[#7651A8] hover:underline flex items-center gap-1"
                        >
                          View Details <ExternalLink className="w-3 h-3" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!item.read && (
                  <button
                    onClick={() => markNotificationRead(item.id)}
                    className="p-1.5 text-[#7651A8] hover:bg-[#F1EAF8] rounded-lg transition-colors text-xs font-semibold"
                    title="Mark as read"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="p-1.5 text-[#77717F] hover:text-[#D92D45] hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
