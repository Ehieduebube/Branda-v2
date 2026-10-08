import type { CartLine, CartTotals, MarketCode, SelectedOption, ServiceImage } from "@/types";

/**
 * Checkout contracts and validation shared by the client form (instant
 * feedback) and the server action (authoritative). No form library needed
 * for five fields; the rules live in one place.
 */

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

export type ContactErrors = Partial<Record<keyof ContactDetails, string>>;

export const CONTACT_LIMITS = { name: 80, email: 254, phone: 20, company: 100, notes: 500 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

export function readContact(form: FormData): ContactDetails {
  const get = (key: keyof ContactDetails) => String(form.get(key) ?? "").trim();
  return { name: get("name"), email: get("email"), phone: get("phone"), company: get("company"), notes: get("notes") };
}

export function validateContact(contact: ContactDetails): ContactErrors {
  const errors: ContactErrors = {};

  if (contact.name.length < 2) errors.name = "Enter your full name.";
  else if (contact.name.length > CONTACT_LIMITS.name) errors.name = `Name must be ${CONTACT_LIMITS.name} characters or fewer.`;

  if (!contact.email) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(contact.email) || contact.email.length > CONTACT_LIMITS.email)
    errors.email = "Enter a valid email address, like name@company.com.";

  if (contact.phone && !PHONE_PATTERN.test(contact.phone))
    errors.phone = "Enter a valid phone number, including the country code if outside your market.";

  if (contact.company.length > CONTACT_LIMITS.company)
    errors.company = `Company name must be ${CONTACT_LIMITS.company} characters or fewer.`;

  if (contact.notes.length > CONTACT_LIMITS.notes)
    errors.notes = `Project notes must be ${CONTACT_LIMITS.notes} characters or fewer.`;

  return errors;
}

/** What the client sends: identities and choices only — never trusted prices. */
export interface OrderLineInput {
  key: string;
  slug: string;
  selections: Record<string, string>;
  quantity: number;
  /** The price the customer saw, used only to detect price changes. */
  expectedUnitPrice: number;
}

export function toOrderLineInput(line: CartLine): OrderLineInput {
  return {
    key: line.key,
    slug: line.slug,
    selections: Object.fromEntries(line.selections.map((s) => [s.groupId, s.choiceId])),
    quantity: line.quantity,
    expectedUnitPrice: line.unitPrice,
  };
}

export interface ConfirmedOrderLine {
  key: string;
  name: string;
  image: ServiceImage;
  selections: SelectedOption[];
  quantity: number;
  unit: string;
  unitPlural: string;
  unitPrice: number;
}

export interface ConfirmedOrder {
  id: string;
  market: MarketCode;
  placedAt: string;
  contact: Pick<ContactDetails, "name" | "email" | "company">;
  lines: ConfirmedOrderLine[];
  totals: CartTotals;
}

export type PlaceOrderResult =
  | { status: "success"; order: ConfirmedOrder }
  | { status: "invalid"; message: string; errors: ContactErrors }
  | { status: "price-changed"; message: string; prices: { key: string; unitPrice: number }[] }
  | { status: "error"; message: string };
