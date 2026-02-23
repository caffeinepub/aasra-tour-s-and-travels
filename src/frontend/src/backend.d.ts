import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Location {
    latitude: number;
    longitude: number;
}
export interface CustomerProfile {
    name: string;
    preferredPaymentMethod?: PaymentMethod;
}
export interface RateCard {
    suv: bigint;
    mini: bigint;
    sedan: bigint;
    premiumSuv: bigint;
}
export interface ReferralBonus {
    driverBonus: bigint;
    customerBonus: bigint;
}
export interface DriverProfile {
    cabNumber: string;
    vehicleType: VehicleType;
    fullName: string;
    yearOfManufacture: bigint;
}
export interface BookingRequestInput {
    destination_address: string;
    pickup_address: string;
    paymentMethod: string;
    pickup_postal_code: string;
    submit_time: bigint;
    cab_rating?: bigint;
    cancel_reason?: string;
    email: string;
    pickup_time: bigint;
    first_name: string;
    last_name: string;
    comments: string;
    phone_number: string;
    destination_postal_code: string;
    driver_rating?: bigint;
}
export interface Attachment {
    contentType: string;
    blob: ExternalBlob;
    name: string;
    uploadTime: bigint;
}
export interface DriverBookingUpdate {
    status: BookingStatus;
    bookingId: bigint;
    reason?: string;
}
export interface BookingRequestView {
    id: bigint;
    destination_address: string;
    status: BookingStatus;
    pickup_address: string;
    paymentMethod: string;
    pickup_postal_code: string;
    submit_time: bigint;
    cab_rating?: bigint;
    declined_by: Array<Principal>;
    cancel_reason?: string;
    email: string;
    driver_location?: Location;
    pickup_time: bigint;
    assigned_driver?: Principal;
    first_name: string;
    last_name: string;
    comments: string;
    phone_number: string;
    destination_postal_code: string;
    driver_rating?: bigint;
    submitted_by: Principal;
}
export type UserProfile = {
    __kind__: "customer";
    customer: CustomerProfile;
} | {
    __kind__: "driver";
    driver: DriverProfile;
};
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    accepted = "accepted",
    refused = "refused"
}
export enum PaymentMethod {
    UPI = "UPI",
    creditCard = "creditCard",
    cash = "cash",
    debitCard = "debitCard"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_cab_driver {
    cab = "cab",
    driver = "driver"
}
export enum VehicleType {
    suv = "suv",
    mini = "mini",
    sedan = "sedan",
    premiumSuv = "premiumSuv"
}
export interface backendInterface {
    applyReferralCode(code: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignDriver(bookingId: bigint, driver: Principal): Promise<void>;
    awardReferralBonuses(bookingId: bigint, customerBonus: bigint, driverBonus: bigint): Promise<void>;
    generateReferralCode(): Promise<string>;
    getAllBookings(): Promise<Array<BookingRequestView>>;
    getAttachment(attachmentType: Variant_cab_driver, user: Principal): Promise<Attachment | null>;
    getBooking(id: bigint): Promise<BookingRequestView>;
    getCallerAttachment(attachmentType: Variant_cab_driver): Promise<Attachment | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDriverBookings(): Promise<Array<BookingRequestView>>;
    getDriverDispatchBookings(): Promise<Array<BookingRequestView>>;
    getDriverLocation(bookingId: bigint): Promise<Location | null>;
    getRateCard(): Promise<RateCard>;
    getReferralBonus(): Promise<ReferralBonus | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBooking(form: BookingRequestInput): Promise<bigint>;
    updateBookingStatus(bookingId: bigint, statusText: string): Promise<void>;
    updateDriverBookingStatus(update: DriverBookingUpdate): Promise<void>;
    updateDriverLocation(bookingId: bigint, location: Location): Promise<void>;
    updateRateCard(newRateCard: RateCard): Promise<void>;
    uploadAttachment(attachmentType: Variant_cab_driver, file: ExternalBlob, name: string, contentType: string): Promise<void>;
}
