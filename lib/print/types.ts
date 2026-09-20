export type PrintMaterialType =
  | 'trifold'
  | 'leaflet-a5'
  | 'leaflet-a4'
  | 'card'
  | 'business-card';

export type PartnerRole = 'agency' | 'affilishop' | 'affiliate';

export interface PartnerPrintData {
  role: PartnerRole;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  invoiceNumber?: string;

  referralCode: string;
  referralUrl: string;

  logoUrl?: string;
}

export interface PrintMaterialMeta {
  type: PrintMaterialType;
  label: string;
  description: string;
  sizeText: string;
  pagesText: string;
}
