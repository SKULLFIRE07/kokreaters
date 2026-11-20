/**
 * Pack 3 lead decision 2: every "Book a 30-minute call" button links here. The booking tool when PUBLIC_BOOKING_URL is
 * set, otherwise the top of the Contact page (`#start`, where the booking block or the form begins).
 */
import { site } from '@/config/site';

export const BOOKING_FALLBACK = '/contact#start';
export const hasBooking: boolean = !!site.bookingUrl;
export const bookingHref = (): string => site.bookingUrl ?? BOOKING_FALLBACK;
/** External booking tools open in a new tab; the fallback is same-site. */
export const bookingIsExternal = (): boolean => /^https?:\/\//.test(bookingHref());
/** The two button labels the brief uses: the full one in bodies, the short one in the header. */
export const bookingLabel = 'Book a 30-minute call';
export const bookingLabelShort = 'Book a call';
