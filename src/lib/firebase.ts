import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCfCCbz9B_QNHPI2jsOj9d8LF03nbcavis',
  authDomain: 'testapp-6d6d3.firebaseapp.com',
  projectId: 'testapp-6d6d3',
  storageBucket: 'testapp-6d6d3.firebasestorage.app',
  messagingSenderId: '611605371813',
  appId: '1:611605371813:web:109547bf18aab3c248a64c',
  measurementId: 'G-JFVPR09DQT',
};

let analytics: Analytics | null = null;

export function initFirebase(): void {
  if (typeof window === 'undefined' || analytics !== null) return;
  try {
    const app = getApps()[0] ?? initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
  } catch (error) {
    // Analytics is unavailable in some browsers (blocked storage, extensions); the site must still work.
    console.warn('Analytics unavailable', error);
  }
}

export function trackEvent(eventName: string): void {
  if (analytics) {
    logEvent(analytics, eventName);
  }
}
