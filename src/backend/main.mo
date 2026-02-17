import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import Migration "migration";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
actor {
  include MixinStorage();
  public type UserRole = AccessControl.UserRole;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type PaymentMethod = {
    #cash;
    #UPI;
    #creditCard;
    #debitCard;
  };

  module PaymentMethod {
    public func fromText(paymentMethodText : Text) : PaymentMethod {
      switch (paymentMethodText) {
        case ("cash") { #cash };
        case ("UPI") { #UPI };
        case ("creditCard") { #creditCard };
        case ("debitCard") { #debitCard };
        case (_) { Runtime.trap("Unsupported payment method: " # paymentMethodText) };
      };
    };
  };

  // User Profile Model
  public type CustomerProfile = {
    name : Text;
    preferredPaymentMethod : ?PaymentMethod;
  };

  public type DriverProfile = {
    fullName : Text;
    cabNumber : Text;
    vehicleType : VehicleType;
    yearOfManufacture : Nat;
  };

  public type UserProfile = {
    #customer : CustomerProfile;
    #driver : DriverProfile;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Attachments Model
  public type Attachment = {
    blob : Storage.ExternalBlob;
    name : Text;
    contentType : Text;
    uploadTime : Int;
  };

  let driverAttachments = Map.empty<Principal, Attachment>();
  let cabAttachments = Map.empty<Principal, Attachment>();

  // User Profile API
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Attachments API
  public shared ({ caller }) func uploadAttachment(
    attachmentType : { #cab; #driver },
    file : Storage.ExternalBlob,
    name : Text,
    contentType : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload attachments");
    };

    let attachment : Attachment = {
      blob = file;
      name;
      contentType;
      uploadTime = Time.now();
    };

    switch (attachmentType) {
      case (#cab) { cabAttachments.add(caller, attachment) };
      case (#driver) { driverAttachments.add(caller, attachment) };
    };
  };

  public query ({ caller }) func getAttachment(
    attachmentType : { #cab; #driver },
    user : Principal
  ) : async ?Attachment {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own attachments or must be admin");
    };

    switch (attachmentType) {
      case (#cab) { cabAttachments.get(user) };
      case (#driver) { driverAttachments.get(user) };
    };
  };

  public query ({ caller }) func getCallerAttachment(
    attachmentType : { #cab; #driver }
  ) : async ?Attachment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access attachments");
    };

    switch (attachmentType) {
      case (#cab) { cabAttachments.get(caller) };
      case (#driver) { driverAttachments.get(caller) };
    };
  };

  // Booking Request Model
  public type BookingStatus = {
    #pending;
    #accepted;
    #completed;
    #cancelled;
    #refused;
  };

  module BookingStatus {
    public func fromText(statusText : Text) : BookingStatus {
      switch (statusText) {
        case ("pending") { #pending };
        case ("accepted") { #accepted };
        case ("completed") { #completed };
        case ("cancelled") { #cancelled };
        case ("refused") { #refused };
        case (_) { Runtime.trap("Unknown status: " # statusText) };
      };
    };
  };

  public type BookingRequest = {
    id : Nat;
    first_name : Text;
    last_name : Text;
    email : Text;
    phone_number : Text;
    pickup_address : Text;
    pickup_postal_code : Text;
    destination_address : Text;
    destination_postal_code : Text;
    pickup_time : Nat;
    comments : Text;
    status : BookingStatus;
    paymentMethod : Text;
    submitted_by : Principal;
    cancel_reason : ?Text;
    submit_time : Int;
    driver_rating : ?Nat;
    cab_rating : ?Nat;
  };

  module BookingRequest {
    public func compareBookingRequestsById(a : BookingRequest, b : BookingRequest) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  let bookingRequests = Map.empty<Nat, BookingRequest>();
  var nextBookingId = 0;

  // Vehicle Types
  public type VehicleType = {
    #mini;
    #sedan;
    #suv;
    #premiumSuv;
  };

  module VehicleType {
    public func fromText(vehicleTypeText : Text) : VehicleType {
      switch (vehicleTypeText) {
        case ("mini") { #mini };
        case ("sedan") { #sedan };
        case ("suv") { #suv };
        case ("premiumSuv") { #premiumSuv };
        case (_) { Runtime.trap("Invalid vehicle type: " # vehicleTypeText) };
      };
    };
  };

  // Rate Card Model
  public type RateCard = {
    mini : Nat;
    sedan : Nat;
    suv : Nat;
    premiumSuv : Nat;
  };

  // Initialize with default rate card values
  var rateCard : RateCard = {
    mini = 15;
    sedan = 18;
    suv = 24;
    premiumSuv = 30;
  };

  // Booking API
  public shared ({ caller }) func submitBooking(form : BookingRequest) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit bookings");
    };
    let id = nextBookingId;
    let booking : BookingRequest = {
      id;
      first_name = form.first_name;
      last_name = form.last_name;
      email = form.email;
      phone_number = form.phone_number;
      pickup_address = form.pickup_address;
      pickup_postal_code = form.pickup_postal_code;
      destination_address = form.destination_address;
      destination_postal_code = form.destination_postal_code;
      pickup_time = form.pickup_time;
      comments = form.comments;
      status = #pending : BookingStatus;
      paymentMethod = form.paymentMethod;
      submitted_by = caller;
      cancel_reason = form.cancel_reason;
      submit_time = form.submit_time;
      driver_rating = form.driver_rating;
      cab_rating = form.cab_rating;
    };
    bookingRequests.add(id, booking);
    nextBookingId += 1;
    id;
  };

  public query ({ caller }) func getAllBookings() : async [BookingRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all booking requests");
    };
    bookingRequests.values().toArray().sort(BookingRequest.compareBookingRequestsById);
  };

  public query ({ caller }) func getBooking(id : Nat) : async BookingRequest {
    switch (bookingRequests.get(id)) {
      case (?booking) {
        if (caller != booking.submitted_by and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings or must be admin");
        };
        booking;
      };
      case (null) { Runtime.trap("Booking request not found for id " # id.toText()) };
    };
  };

  // Rate Card API (Admin Only)
  public query ({ caller }) func getRateCard() : async RateCard {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view the rate card");
    };
    rateCard;
  };

  public shared ({ caller }) func updateRateCard(newRateCard : RateCard) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update the rate card");
    };
    rateCard := newRateCard;
  };

  // Referral System
  public type ReferralBonus = {
    customerBonus : Nat;
    driverBonus : Nat;
  };

  let referralBonuses = Map.empty<Principal, ReferralBonus>();
  let referralCodes = Map.empty<Text, Principal>();
  let appliedReferrals = Map.empty<Principal, Principal>(); // Maps referred user -> referrer

  // Referral API
  public shared ({ caller }) func generateReferralCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate referral codes");
    };

    let code = "REF-" # caller.toText();
    referralCodes.add(code, caller);
    code;
  };

  public shared ({ caller }) func applyReferralCode(code : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply referral codes");
    };

    // Check if user has already applied a referral code
    switch (appliedReferrals.get(caller)) {
      case (?_) {
        Runtime.trap("Unauthorized: You have already applied a referral code");
      };
      case (null) {
        // User hasn't applied a code yet, proceed
      };
    };

    switch (referralCodes.get(code)) {
      case (?referrer) {
        if (referrer == caller) {
          Runtime.trap("Unauthorized: Cannot use your own referral code");
        };

        // Record that this user has applied a referral code
        appliedReferrals.add(caller, referrer);
      };
      case (null) { Runtime.trap("Invalid referral code") };
    };
  };

  // Admin-only API to award referral bonuses
  public shared ({ caller }) func awardReferralBonuses(
    bookingId : Nat,
    customerBonus : Nat,
    driverBonus : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can award referral bonuses");
    };

    switch (bookingRequests.get(bookingId)) {
      case (?booking) {
        let referredUser = booking.submitted_by;

        // Check if this user was referred by someone
        switch (appliedReferrals.get(referredUser)) {
          case (?referrer) {
            // Award bonus to the referrer
            let referrerCurrentBonus = switch (referralBonuses.get(referrer)) {
              case (?bonus) { bonus };
              case (null) {
                {
                  customerBonus = 0;
                  driverBonus = 0;
                };
              };
            };

            let referrerUpdatedBonus = {
              customerBonus = referrerCurrentBonus.customerBonus + customerBonus;
              driverBonus = referrerCurrentBonus.driverBonus + driverBonus;
            };

            referralBonuses.add(referrer, referrerUpdatedBonus);

            // Award bonus to the referred user
            let referredCurrentBonus = switch (referralBonuses.get(referredUser)) {
              case (?bonus) { bonus };
              case (null) {
                {
                  customerBonus = 0;
                  driverBonus = 0;
                };
              };
            };

            let referredUpdatedBonus = {
              customerBonus = referredCurrentBonus.customerBonus + customerBonus;
              driverBonus = referredCurrentBonus.driverBonus + driverBonus;
            };

            referralBonuses.add(referredUser, referredUpdatedBonus);
          };
          case (null) {
            // User wasn't referred, no bonuses to award
          };
        };
      };
      case (null) { Runtime.trap("Booking not found for id " # bookingId.toText()) };
    };
  };

  public query ({ caller }) func getReferralBonus() : async ?ReferralBonus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their referral bonuses");
    };
    referralBonuses.get(caller);
  };
};
