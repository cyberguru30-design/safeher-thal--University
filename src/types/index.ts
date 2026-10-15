export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  bloodType?: string;
  emergencyNotes?: string;
  address?: string;
  university?: string;
  department?: string;
  createdAt: string;
}

export type NotificationMethod = 'SMS' | 'Call' | 'WhatsApp' | 'Email';

export interface TrustedContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  preferredMethod: NotificationMethod;
  isPrimary: boolean;
  canReceiveAlerts: boolean;
  createdAt: string;
}

export type SOSEventStatus = 'active' | 'resolved' | 'cancelled' | 'test';

export interface SOSNotificationDelivery {
  contactId: string;
  contactName: string;
  method: NotificationMethod;
  status: 'pending' | 'delivered' | 'failed' | 'simulated';
  deliveredAt?: string;
  error?: string;
}

export interface SOSEvent {
  id: string;
  userId: string;
  userName: string;
  activatedAt: string;
  resolvedAt?: string;
  status: SOSEventStatus;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  address?: string;
  isDemo: boolean;
  notes?: string;
  deliveries: SOSNotificationDelivery[];
}

export type JourneyStatus = 'Planned' | 'Active' | 'Check-in Due' | 'Completed' | 'Cancelled';

export interface SafeJourney {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startLocation: string;
  startTime: string;
  expectedArrivalTime: string;
  status: JourneyStatus;
  selectedContactIds: string[];
  checkInIntervalMinutes: number;
  lastCheckInAt?: string;
  nextCheckInDue?: string;
  checkInCount: number;
  notes?: string;
  createdAt: string;
}

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Under Review' | 'Verified' | 'Resolved' | 'Dismissed';

export interface IncidentReport {
  id: string;
  userId: string;
  reporterName?: string;
  isAnonymous: boolean;
  incidentType: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  locationName: string;
  latitude?: number;
  longitude?: number;
  occurredAt: string;
  description: string;
  imageUrl?: string;
  adminNotes?: string;
  createdAt: string;
}

export type SafetyResourceType = 'Police' | 'Hospital' | 'Transport' | 'HelpPoint' | 'Helpline';

export interface SafetyResource {
  id: string;
  name: string;
  category: SafetyResourceType;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  distanceKm?: number;
  verified: boolean;
  description?: string;
}

export type NotificationType = 'sos_alert' | 'journey_reminder' | 'contact_update' | 'incident_update' | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  severity?: 'normal' | 'warning' | 'emergency';
}

export interface ActivityTimelineItem {
  id: string;
  type: 'sos' | 'contact' | 'journey' | 'incident' | 'checkin';
  title: string;
  description: string;
  timestamp: string;
  badgeColor?: string;
}
