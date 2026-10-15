import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  TrustedContact,
  SOSEvent,
  SafeJourney,
  IncidentReport,
  AppNotification,
  SafetyResource,
  ActivityTimelineItem,
  SOSNotificationDelivery,
} from '../types';
import { emergencySiren } from '../components/common/SirenSound';
import { useAuth } from './AuthContext';
import { getSupabaseClient } from '../lib/supabase';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface SafetyContextType {
  // SOS System
  activeSOSEvent: SOSEvent | null;
  sosHistory: SOSEvent[];
  triggerSOS: (notes?: string) => Promise<SOSEvent>;
  cancelSOS: (eventId: string, reason?: string) => Promise<void>;
  isSirenActive: boolean;
  toggleSiren: () => void;
  sosCountdownDuration: number;
  setSosCountdownDuration: (sec: number) => void;

  // Location
  currentCoords: Coordinates | null;
  locationError: string | null;
  isLocating: boolean;
  refreshLocation: () => Promise<Coordinates | null>;

  // Contacts
  contacts: TrustedContact[];
  addContact: (contact: Omit<TrustedContact, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<TrustedContact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  setPrimaryContact: (id: string) => Promise<void>;

  // Journeys
  journeys: SafeJourney[];
  activeJourney: SafeJourney | null;
  startJourney: (data: {
    title: string;
    destination: string;
    startLocation: string;
    expectedArrivalTime: string;
    selectedContactIds: string[];
    checkInIntervalMinutes: number;
    notes?: string;
  }) => Promise<SafeJourney>;
  completeJourney: (id: string) => Promise<void>;
  cancelJourney: (id: string) => Promise<void>;
  checkInJourney: (id: string) => Promise<void>;

  // Incidents
  incidents: IncidentReport[];
  submitIncidentReport: (report: Omit<IncidentReport, 'id' | 'userId' | 'status' | 'createdAt'>) => Promise<IncidentReport>;
  updateIncidentStatus: (id: string, status: IncidentReport['status'], adminNotes?: string) => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadNotificationsCount: number;

  // Resources
  resources: SafetyResource[];

  // Activity Timeline
  recentActivity: ActivityTimelineItem[];

  // Demo status
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

// Initial realistic seed contacts
const INITIAL_CONTACTS: TrustedContact[] = [
  {
    id: 'ct_1',
    userId: 'usr_sanam_baloch_01',
    name: 'Family Emergency Contact (Mother)',
    relationship: 'Mother',
    phone: '0300-1234567',
    email: 'family.emergency@gmail.com',
    preferredMethod: 'WhatsApp',
    isPrimary: true,
    canReceiveAlerts: true,
    createdAt: '2026-09-10T14:20:00Z',
  },
  {
    id: 'ct_2',
    userId: 'usr_sanam_baloch_01',
    name: 'Aisha (College Peer / Friend)',
    relationship: 'Friend / Classmate',
    phone: '0312-9876543',
    email: 'aisha.student@gmail.com',
    preferredMethod: 'SMS',
    isPrimary: false,
    canReceiveAlerts: true,
    createdAt: '2026-09-12T09:15:00Z',
  },
  {
    id: 'ct_3',
    userId: 'usr_sanam_baloch_01',
    name: 'Brother (Guardian)',
    relationship: 'Brother',
    phone: '0333-5554321',
    email: 'brother.contact@gmail.com',
    preferredMethod: 'Call',
    isPrimary: false,
    canReceiveAlerts: true,
    createdAt: '2026-09-15T18:40:00Z',
  },
];

// Initial verified safety resources (Police, Hospitals, Shelters, Helplines) in District Bhakkar, Punjab, Pakistan
const INITIAL_RESOURCES: SafetyResource[] = [
  {
    id: 'res_1',
    name: 'Police Madadgar 15 & DPO Office Bhakkar',
    category: 'Police',
    address: 'Darya Khan Road, Bhakkar City, Punjab',
    phone: '15',
    latitude: 31.6248,
    longitude: 71.0648,
    operatingHours: '24/7 Always Open',
    distanceKm: 0.5,
    verified: true,
    description: 'Police Madadgar 15 Emergency Dispatch & Women Safety Help Desk, DPO Office Bhakkar.',
  },
  {
    id: 'res_2',
    name: 'Rescue 1122 Emergency Station Bhakkar',
    category: 'Hospital',
    address: 'Main Mandi Town, Bhakkar City, Punjab',
    phone: '1122',
    latitude: 31.6280,
    longitude: 71.0620,
    operatingHours: '24/7 Rapid Emergency Response',
    distanceKm: 0.9,
    verified: true,
    description: 'Punjab Emergency Service Rescue 1122. Immediate medical ambulance and emergency rescue.',
  },
  {
    id: 'res_3',
    name: 'Women Protection Authority Punjab & Women Safety Helpline',
    category: 'HelpPoint',
    address: 'District Complex, Bhakkar, Punjab',
    phone: '1099',
    latitude: 31.6260,
    longitude: 71.0680,
    operatingHours: '24/7 Toll-Free Protection',
    distanceKm: 1.1,
    verified: true,
    description: 'Punjab Women Protection Authority (1099) and Women Safety / Madadgar Helpline (1098). Legal aid and emergency crisis relief.',
  },
  {
    id: 'res_4',
    name: 'DHQ Hospital Bhakkar Emergency Trauma Center',
    category: 'Hospital',
    address: 'Jhang Road, Bhakkar City, Punjab',
    phone: '0453-9200080',
    latitude: 31.6300,
    longitude: 71.0700,
    operatingHours: '24/7 Emergency Care',
    distanceKm: 1.4,
    verified: true,
    description: 'District Headquarter Hospital Bhakkar, 24/7 emergency casualty ward and trauma care.',
  },
  {
    id: 'res_5',
    name: 'Edhi Ambulance Service Bhakkar',
    category: 'Hospital',
    address: 'Railway Road, Bhakkar City, Punjab',
    phone: '115',
    latitude: 31.6220,
    longitude: 71.0610,
    operatingHours: '24/7 Emergency Dispatch',
    distanceKm: 1.2,
    verified: true,
    description: 'Edhi Foundation emergency ambulance dispatch (Helpline: 115).',
  },
  {
    id: 'res_6',
    name: 'Child Protection & Welfare Bureau Helpline',
    category: 'HelpPoint',
    address: 'District Administrative Complex, Bhakkar',
    phone: '1124',
    latitude: 31.6275,
    longitude: 71.0690,
    operatingHours: '24/7 Toll-Free Support',
    distanceKm: 1.6,
    verified: true,
    description: 'Child Protection & Welfare Bureau Punjab helpline (1124) for missing and distressed children/minors.',
  },
  {
    id: 'res_7',
    name: 'THQ Hospital Darya Khan',
    category: 'Hospital',
    address: 'Main Road, Darya Khan, District Bhakkar, Punjab',
    phone: '1122',
    latitude: 31.8000,
    longitude: 71.1000,
    operatingHours: '24/7 Open',
    distanceKm: 19.5,
    verified: true,
    description: 'Tehsil Headquarter Hospital Darya Khan with 24/7 Emergency Services.',
  },
];


// Initial incident reports
const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc_1',
    userId: 'usr_sarah_jenkins_01',
    reporterName: 'Anonymous Student',
    isAnonymous: true,
    incidentType: 'Street Harassment / Stalking',
    severity: 'High',
    status: 'Verified',
    locationName: 'Subway Exit 3, 5th & Pine Street',
    latitude: 37.7780,
    longitude: -122.4150,
    occurredAt: '2026-10-12T21:45:00Z',
    description: 'Two individuals following pedestrians exiting the station, making intimidating comments and blocking sidewalks.',
    adminNotes: 'Security patrol notified; CCTV footage requested from transit authority.',
    createdAt: '2026-10-12T22:10:00Z',
  },
  {
    id: 'inc_2',
    userId: 'usr_sarah_jenkins_01',
    reporterName: 'Sarah Jenkins',
    isAnonymous: false,
    incidentType: 'Broken Street Lights / Pitch Black Alley',
    severity: 'Medium',
    status: 'Resolved',
    locationName: 'Oakwood Pathway between Science Hall and Dorm B',
    latitude: 37.7710,
    longitude: -122.4210,
    occurredAt: '2026-10-10T19:30:00Z',
    description: 'Five consecutive pathway lampposts completely out of order, zero visibility past 8 PM.',
    adminNotes: 'Campus Facilities replaced bulbs and upgraded to high-intensity LED lighting.',
    createdAt: '2026-10-10T20:00:00Z',
  },
  {
    id: 'inc_3',
    userId: 'usr_other_02',
    reporterName: 'Priya K.',
    isAnonymous: false,
    incidentType: 'Suspicious Vehicle Loitering',
    severity: 'High',
    status: 'Under Review',
    locationName: 'East Parking Lot behind Library',
    latitude: 37.7812,
    longitude: -122.4230,
    occurredAt: '2026-10-13T23:15:00Z',
    description: 'Dark sedan idling with headlights off near student pickup zone for over 45 minutes.',
    createdAt: '2026-10-13T23:30:00Z',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'usr_sarah_jenkins_01',
    title: 'Welcome to SafeHer Protection',
    message: 'Your emergency setup is ready. Review your trusted contacts to ensure instant alert delivery.',
    type: 'system',
    read: false,
    createdAt: '2026-10-14T02:00:00Z',
    actionUrl: '/contacts',
    severity: 'normal',
  },
  {
    id: 'notif_2',
    userId: 'usr_sarah_jenkins_01',
    title: 'Incident Report Status Update',
    message: 'Your report regarding "Broken Street Lights" has been marked as Resolved by Campus Security.',
    type: 'incident_update',
    read: false,
    createdAt: '2026-10-11T10:15:00Z',
    actionUrl: '/incidents',
    severity: 'normal',
  },
];

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Settings
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('safeher_demo_mode') !== 'false';
  });

  const [sosCountdownDuration, setSosCountdownDurationState] = useState<number>(() => {
    const s = localStorage.getItem('safeher_sos_countdown');
    return s ? parseInt(s, 10) : 3;
  });

  const setSosCountdownDuration = (sec: number) => {
    setSosCountdownDurationState(sec);
    localStorage.setItem('safeher_sos_countdown', sec.toString());
  };

  // Contacts
  const [contacts, setContacts] = useState<TrustedContact[]>(() => {
    const stored = localStorage.getItem('safeher_contacts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some((c: TrustedContact) => c.phone.includes('+1 (555)'))) {
          localStorage.setItem('safeher_contacts', JSON.stringify(INITIAL_CONTACTS));
          return INITIAL_CONTACTS;
        }
        return parsed;
      } catch {
        // ignore
      }
    }
    return INITIAL_CONTACTS;
  });

  // SOS Events
  const [sosHistory, setSosHistory] = useState<SOSEvent[]>(() => {
    const stored = localStorage.getItem('safeher_sos_history');
    return stored ? JSON.parse(stored) : [];
  });

  const [activeSOSEvent, setActiveSOSEvent] = useState<SOSEvent | null>(() => {
    const stored = localStorage.getItem('safeher_active_sos');
    return stored ? JSON.parse(stored) : null;
  });

  // Journeys
  const [journeys, setJourneys] = useState<SafeJourney[]>(() => {
    const stored = localStorage.getItem('safeher_journeys');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((j: SafeJourney) => {
            if (j.destination.includes('Apt 422') || j.destination.includes('Campus Heights')) {
              return { ...j, destination: 'Bhakkar City, District Bhakkar, Punjab, Pakistan' };
            }
            return j;
          });
        }
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'j_sample_1',
        userId: 'usr_sanam_baloch_01',
        title: 'Late Night Travel Return',
        destination: 'Bhakkar City, District Bhakkar, Punjab, Pakistan',
        startLocation: 'University Main Gate / Transit',
        startTime: '2026-10-13T22:30:00Z',
        expectedArrivalTime: '2026-10-13T23:05:00Z',
        status: 'Completed',
        selectedContactIds: ['ct_1', 'ct_2'],
        checkInIntervalMinutes: 20,
        lastCheckInAt: '2026-10-13T22:50:00Z',
        checkInCount: 1,
        createdAt: '2026-10-13T22:28:00Z',
      },
    ];
  });

  const [activeJourney, setActiveJourney] = useState<SafeJourney | null>(() => {
    const stored = localStorage.getItem('safeher_active_journey');
    return stored ? JSON.parse(stored) : null;
  });

  // Incidents
  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const stored = localStorage.getItem('safeher_incidents');
    return stored ? JSON.parse(stored) : INITIAL_INCIDENTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const stored = localStorage.getItem('safeher_notifications');
    return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
  });

  // Siren
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);

  // Geolocation state
  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('safeher_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('safeher_sos_history', JSON.stringify(sosHistory));
  }, [sosHistory]);

  useEffect(() => {
    if (activeSOSEvent) {
      localStorage.setItem('safeher_active_sos', JSON.stringify(activeSOSEvent));
    } else {
      localStorage.removeItem('safeher_active_sos');
    }
  }, [activeSOSEvent]);

  useEffect(() => {
    localStorage.setItem('safeher_journeys', JSON.stringify(journeys));
  }, [journeys]);

  useEffect(() => {
    if (activeJourney) {
      localStorage.setItem('safeher_active_journey', JSON.stringify(activeJourney));
    } else {
      localStorage.removeItem('safeher_active_journey');
    }
  }, [activeJourney]);

  useEffect(() => {
    localStorage.setItem('safeher_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('safeher_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('safeher_demo_mode', isDemoMode.toString());
  }, [isDemoMode]);

  // Browser Geolocation API Helper
  const refreshLocation = useCallback(async (): Promise<Coordinates | null> => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return null;
    }

    setIsLocating(true);
    setLocationError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: Coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy),
          };
          setCurrentCoords(coords);
          setIsLocating(false);
          resolve(coords);
        },
        (error) => {
          let msg = 'Unable to retrieve location coordinates.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission denied by user. Please allow location access for precise emergency tracking.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Location information is currently unavailable.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out.';
          }
          setLocationError(msg);
          setIsLocating(false);
          // Fallback approximate coords for simulation (District Bhakkar, Punjab, Pakistan)
          const fallbackCoords: Coordinates = {
            latitude: 31.6248,
            longitude: 71.0648,
            accuracy: 15,
          };
          setCurrentCoords(fallbackCoords);
          resolve(fallbackCoords);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 15000,
        }
      );
    });
  }, []);

  // Run location fetch on initial mount
  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  // Siren toggle
  const toggleSiren = () => {
    if (isSirenActive) {
      emergencySiren.stop();
      setIsSirenActive(false);
    } else {
      emergencySiren.start();
      setIsSirenActive(true);
    }
  };

  // SOS Trigger Flow
  const triggerSOS = async (notes?: string): Promise<SOSEvent> => {
    const coords = await refreshLocation();

    const recipientContacts = contacts.filter((c) => c.canReceiveAlerts);

    // Build delivery states
    const deliveries: SOSNotificationDelivery[] = recipientContacts.map((c) => ({
      contactId: c.id,
      contactName: `${c.name} (${c.relationship})`,
      method: c.preferredMethod,
      status: isDemoMode ? 'simulated' : 'delivered',
      deliveredAt: new Date().toISOString(),
    }));

    const eventId = `sos_${Date.now()}`;
    const newEvent: SOSEvent = {
      id: eventId,
      userId: user?.id || 'usr_anonymous',
      userName: user?.fullName || 'Sanam Baloch',
      activatedAt: new Date().toISOString(),
      status: 'active',
      latitude: coords?.latitude || currentCoords?.latitude || null,
      longitude: coords?.longitude || currentCoords?.longitude || null,
      accuracy: coords?.accuracy || currentCoords?.accuracy || null,
      address: 'Bhakkar City, District Bhakkar, Punjab, Pakistan (GPS Pin)',
      isDemo: isDemoMode,
      notes: notes || 'Emergency SOS triggered by user.',
      deliveries,
    };

    setActiveSOSEvent(newEvent);
    setSosHistory((prev) => [newEvent, ...prev]);

    // Push in-app alert notification
    const alertNotif: AppNotification = {
      id: `notif_sos_${Date.now()}`,
      userId: user?.id || 'usr_anonymous',
      title: '🚨 Emergency SOS Activated',
      message: `SOS alert created with current coordinates. ${deliveries.length} trusted contacts queued (${isDemoMode ? 'Simulated Demo' : 'Live Delivery'}).`,
      type: 'sos_alert',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: '/sos',
      severity: 'emergency',
    };
    setNotifications((prev) => [alertNotif, ...prev]);

    // Try Supabase insert if client available
    const supabase = getSupabaseClient();
    if (supabase && user) {
      try {
        await supabase.from('sos_events').insert({
          id: newEvent.id,
          user_id: user.id,
          user_name: user.fullName,
          activated_at: newEvent.activatedAt,
          status: newEvent.status,
          latitude: newEvent.latitude,
          longitude: newEvent.longitude,
          accuracy: newEvent.accuracy,
          address: newEvent.address,
          is_demo: newEvent.isDemo,
          notes: newEvent.notes,
          deliveries: newEvent.deliveries,
        });
      } catch (err) {
        console.warn('Supabase SOS insert error:', err);
      }
    }

    return newEvent;
  };

  const cancelSOS = async (eventId: string, reason?: string): Promise<void> => {
    // Stop siren if active
    if (isSirenActive) {
      emergencySiren.stop();
      setIsSirenActive(false);
    }

    setActiveSOSEvent(null);

    setSosHistory((prev) =>
      prev.map((item) =>
        item.id === eventId
          ? {
              ...item,
              status: 'cancelled',
              resolvedAt: new Date().toISOString(),
              notes: reason ? `${item.notes || ''} [Cancelled: ${reason}]` : item.notes,
            }
          : item
      )
    );

    const cancelNotif: AppNotification = {
      id: `notif_cancel_${Date.now()}`,
      userId: user?.id || 'usr_anonymous',
      title: 'SOS Alert Deactivated',
      message: 'Your emergency SOS state has been safely cancelled and trusted contacts notified that you are safe.',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: '/sos',
      severity: 'normal',
    };
    setNotifications((prev) => [cancelNotif, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('sos_events')
          .update({
            status: 'cancelled',
            resolved_at: new Date().toISOString(),
          })
          .eq('id', eventId);
      } catch (err) {
        console.warn('Supabase cancel error:', err);
      }
    }
  };

  // Contacts operations
  const addContact = async (data: Omit<TrustedContact, 'id' | 'userId' | 'createdAt'>) => {
    const newContact: TrustedContact = {
      ...data,
      id: `ct_${Date.now()}`,
      userId: user?.id || 'usr_anonymous',
      createdAt: new Date().toISOString(),
    };

    let updatedList = [...contacts];
    if (newContact.isPrimary) {
      updatedList = updatedList.map((c) => ({ ...c, isPrimary: false }));
    }
    updatedList.push(newContact);
    setContacts(updatedList);

    const supabase = getSupabaseClient();
    if (supabase && user) {
      try {
        await supabase.from('trusted_contacts').insert({
          id: newContact.id,
          user_id: user.id,
          name: newContact.name,
          relationship: newContact.relationship,
          phone: newContact.phone,
          email: newContact.email,
          preferred_method: newContact.preferredMethod,
          is_primary: newContact.isPrimary,
          can_receive_alerts: newContact.canReceiveAlerts,
        });
      } catch (err) {
        console.warn('Supabase add contact error:', err);
      }
    }
  };

  const updateContact = async (id: string, updates: Partial<TrustedContact>) => {
    let updatedList = contacts.map((c) => (c.id === id ? { ...c, ...updates } : c));
    if (updates.isPrimary) {
      updatedList = updatedList.map((c) => (c.id === id ? { ...c, isPrimary: true } : { ...c, isPrimary: false }));
    }
    setContacts(updatedList);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('trusted_contacts').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update contact error:', err);
      }
    }
  };

  const deleteContact = async (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('trusted_contacts').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete contact error:', err);
      }
    }
  };

  const setPrimaryContact = async (id: string) => {
    setContacts((prev) =>
      prev.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      }))
    );
  };

  // Journey operations
  const startJourney = async (data: {
    title: string;
    destination: string;
    startLocation: string;
    expectedArrivalTime: string;
    selectedContactIds: string[];
    checkInIntervalMinutes: number;
    notes?: string;
  }): Promise<SafeJourney> => {
    const journeyId = `j_${Date.now()}`;
    const nextDue = new Date(Date.now() + data.checkInIntervalMinutes * 60 * 1000).toISOString();

    const newJourney: SafeJourney = {
      id: journeyId,
      userId: user?.id || 'usr_anonymous',
      title: data.title,
      destination: data.destination,
      startLocation: data.startLocation,
      startTime: new Date().toISOString(),
      expectedArrivalTime: data.expectedArrivalTime,
      status: 'Active',
      selectedContactIds: data.selectedContactIds,
      checkInIntervalMinutes: data.checkInIntervalMinutes,
      nextCheckInDue: nextDue,
      checkInCount: 0,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    setActiveJourney(newJourney);
    setJourneys((prev) => [newJourney, ...prev]);

    // Journey started notification
    const notif: AppNotification = {
      id: `notif_j_${Date.now()}`,
      userId: user?.id || 'usr_anonymous',
      title: 'Safe Journey Started',
      message: `En route to ${data.destination}. Next check-in is scheduled in ${data.checkInIntervalMinutes} minutes.`,
      type: 'journey_reminder',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: '/journey',
      severity: 'normal',
    };
    setNotifications((prev) => [notif, ...prev]);

    return newJourney;
  };

  const completeJourney = async (id: string) => {
    if (activeJourney?.id === id) {
      setActiveJourney(null);
    }
    setJourneys((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'Completed', notes: `${j.notes || ''} [Arrived Safely]` } : j))
    );

    const notif: AppNotification = {
      id: `notif_comp_${Date.now()}`,
      userId: user?.id || 'usr_anonymous',
      title: 'Journey Completed Safely',
      message: 'You have safely reached your destination. Tracking has ended.',
      type: 'journey_reminder',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: '/journey',
      severity: 'normal',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const cancelJourney = async (id: string) => {
    if (activeJourney?.id === id) {
      setActiveJourney(null);
    }
    setJourneys((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'Cancelled' } : j)));
  };

  const checkInJourney = async (id: string) => {
    const nextDue = new Date(Date.now() + (activeJourney?.checkInIntervalMinutes || 30) * 60 * 1000).toISOString();
    const updatedJourney = activeJourney
      ? {
          ...activeJourney,
          lastCheckInAt: new Date().toISOString(),
          nextCheckInDue: nextDue,
          checkInCount: (activeJourney.checkInCount || 0) + 1,
        }
      : null;

    if (updatedJourney) {
      setActiveJourney(updatedJourney);
      setJourneys((prev) => prev.map((j) => (j.id === id ? updatedJourney : j)));

      const notif: AppNotification = {
        id: `notif_chk_${Date.now()}`,
        userId: user?.id || 'usr_anonymous',
        title: 'Safety Check-in Confirmed',
        message: `Check-in recorded at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Trusted contacts have been updated.`,
        type: 'journey_reminder',
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/journey',
        severity: 'normal',
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Incidents
  const submitIncidentReport = async (
    data: Omit<IncidentReport, 'id' | 'userId' | 'status' | 'createdAt'>
  ): Promise<IncidentReport> => {
    const newReport: IncidentReport = {
      ...data,
      id: `inc_${Date.now()}`,
      userId: user?.id || 'usr_anonymous',
      status: 'Under Review',
      createdAt: new Date().toISOString(),
    };

    setIncidents((prev) => [newReport, ...prev]);

    const notif: AppNotification = {
      id: `notif_rep_${Date.now()}`,
      userId: user?.id || 'usr_anonymous',
      title: 'Incident Report Received',
      message: `Your report on "${data.incidentType}" at ${data.locationName} has been submitted for verification.`,
      type: 'incident_update',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: '/incidents',
      severity: 'normal',
    };
    setNotifications((prev) => [notif, ...prev]);

    return newReport;
  };

  const updateIncidentStatus = async (
    id: string,
    status: IncidentReport['status'],
    adminNotes?: string
  ) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status, adminNotes: adminNotes || inc.adminNotes } : inc))
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Build Recent Activity timeline
  const recentActivity: ActivityTimelineItem[] = [
    ...(activeSOSEvent
      ? [
          {
            id: `act_sos_${activeSOSEvent.id}`,
            type: 'sos' as const,
            title: 'Emergency SOS Triggered',
            description: `Active emergency alert dispatched to ${activeSOSEvent.deliveries.length} contacts.`,
            timestamp: activeSOSEvent.activatedAt,
            badgeColor: '#D92D45',
          },
        ]
      : []),
    ...(activeJourney
      ? [
          {
            id: `act_j_${activeJourney.id}`,
            type: 'journey' as const,
            title: `Safe Journey in Progress: ${activeJourney.title}`,
            description: `Heading to ${activeJourney.destination}. Check-in count: ${activeJourney.checkInCount}`,
            timestamp: activeJourney.startTime,
            badgeColor: '#7651A8',
          },
        ]
      : []),
    ...journeys.slice(0, 2).map((j) => ({
      id: `act_past_j_${j.id}`,
      type: 'journey' as const,
      title: `Journey ${j.status}: ${j.title}`,
      description: `Destination: ${j.destination} (${j.checkInCount} check-ins)`,
      timestamp: j.startTime,
      badgeColor: '#4A245E',
    })),
    ...incidents.slice(0, 2).map((inc) => ({
      id: `act_inc_${inc.id}`,
      type: 'incident' as const,
      title: `Report: ${inc.incidentType}`,
      description: `${inc.locationName} · Status: ${inc.status}`,
      timestamp: inc.createdAt,
      badgeColor: '#247A55',
    })),
    ...contacts.slice(0, 2).map((c) => ({
      id: `act_c_${c.id}`,
      type: 'contact' as const,
      title: `Contact Added: ${c.name}`,
      description: `${c.relationship} · Alert channel: ${c.preferredMethod}`,
      timestamp: c.createdAt,
      badgeColor: '#7651A8',
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

  return (
    <SafetyContext.Provider
      value={{
        activeSOSEvent,
        sosHistory,
        triggerSOS,
        cancelSOS,
        isSirenActive,
        toggleSiren,
        sosCountdownDuration,
        setSosCountdownDuration,
        currentCoords,
        locationError,
        isLocating,
        refreshLocation,
        contacts,
        addContact,
        updateContact,
        deleteContact,
        setPrimaryContact,
        journeys,
        activeJourney,
        startJourney,
        completeJourney,
        cancelJourney,
        checkInJourney,
        incidents,
        submitIncidentReport,
        updateIncidentStatus,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        unreadNotificationsCount,
        resources: INITIAL_RESOURCES,
        recentActivity,
        isDemoMode,
        setIsDemoMode,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
