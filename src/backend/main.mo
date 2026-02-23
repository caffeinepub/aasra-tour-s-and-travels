import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

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

  public type Attachment = {
    blob : Storage.ExternalBlob;
    name : Text;
    contentType : Text;
    uploadTime : Int;
  };

  let driverAttachments = Map.empty<Principal, Attachment>();
  let cabAttachments = Map.empty<Principal, Attachment>();

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

  // BookingRequestInput: Immutable type for input, eliminates mutable types from API
  public type BookingRequestInput = {
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
    paymentMethod : Text;
    cancel_reason : ?Text;
    submit_time : Int;
    driver_rating : ?Nat;
    cab_rating : ?Nat;
  };

  public type BookingRequestView = {
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
    assigned_driver : ?Principal;
    driver_location : ?Location;
    declined_by : [Principal]; // immutable view
  };

  module BookingRequestView {
    public func compareBookingRequestsById(a : BookingRequestView, b : BookingRequestView) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  let bookingRequests = Map.empty<Nat, BookingRequest>();
  var nextBookingId = 0;

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
    assigned_driver : ?Principal;
    driver_location : ?Location;
    declined_by : List.List<Principal>; // internal mutable state
  };

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

  public type RateCard = {
    mini : Nat;
    sedan : Nat;
    suv : Nat;
    premiumSuv : Nat;
  };

  var rateCard : RateCard = {
    mini = 15;
    sedan = 18;
    suv = 24;
    premiumSuv = 30;
  };

  public shared ({ caller }) func submitBooking(form : BookingRequestInput) : async Nat {
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
      assigned_driver = null;
      driver_location = null;
      declined_by = List.empty<Principal>();
    };
    bookingRequests.add(id, booking);
    nextBookingId += 1;
    id;
  };

  func toBookingRequestView(booking : BookingRequest) : BookingRequestView {
    let declinedByArray = booking.declined_by.toArray();
    {
      booking with
      declined_by = declinedByArray;
    };
  };

  public query ({ caller }) func getAllBookings() : async [BookingRequestView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all booking requests");
    };
    let bookingsArray = bookingRequests.values().toArray();
    bookingsArray.map(func(b) { toBookingRequestView(b) }).sort(BookingRequestView.compareBookingRequestsById);
  };

  public query ({ caller }) func getBooking(id : Nat) : async BookingRequestView {
    switch (bookingRequests.get(id)) {
      case (?booking) {
        if (caller != booking.submitted_by and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings or must be admin");
        };
        toBookingRequestView(booking);
      };
      case (null) { Runtime.trap("Booking request not found for id " # id.toText()) };
    };
  };

  public shared ({ caller }) func assignDriver(bookingId : Nat, driver : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can assign drivers");
    };
    switch (userProfiles.get(driver)) {
      case (?profile) {
        switch (profile) {
          case (#driver(_)) { };
          case (#customer(_)) {
            Runtime.trap("Unauthorized: Cannot assign a customer as a driver");
          };
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: Cannot assign a user without a driver profile");
      };
    };
    switch (bookingRequests.get(bookingId)) {
      case (?booking) {
        let updatedBooking = {
          booking with
          status = #accepted;
          assigned_driver = ?driver;
        };
        bookingRequests.add(bookingId, updatedBooking);
      };
      case (null) { Runtime.trap("Booking request not found for id " # bookingId.toText()) };
    };
  };

  public type Location = {
    latitude : Float;
    longitude : Float;
  };

  public shared ({ caller }) func updateDriverLocation(bookingId : Nat, location : Location) : async () {
    switch (bookingRequests.get(bookingId)) {
      case (?booking) {
        if (booking.assigned_driver == ?caller or AccessControl.isAdmin(accessControlState, caller)) {
          let updatedBooking = {
            booking with
            driver_location = ?location;
          };
          bookingRequests.add(bookingId, updatedBooking);
        } else {
          Runtime.trap("Unauthorized: Only the assigned driver or admin can update driver location");
        };
      };
      case (null) { Runtime.trap("Booking not found for id " # bookingId.toText()) };
    };
  };

  public query ({ caller }) func getDriverLocation(bookingId : Nat) : async ?Location {
    switch (bookingRequests.get(bookingId)) {
      case (?booking) {
        if (caller == booking.submitted_by or booking.assigned_driver == ?caller or AccessControl.isAdmin(accessControlState, caller)) {
          booking.driver_location;
        } else {
          Runtime.trap("Unauthorized: Only the booking customer, assigned driver, or admin can view driver location");
        };
      };
      case (null) { Runtime.trap("Booking not found for id " # bookingId.toText()) };
    };
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, statusText : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };

    switch (bookingRequests.get(bookingId)) {
      case (?booking) {
        let newStatus = BookingStatus.fromText(statusText);
        let updatedBooking = {
          booking with
          status = newStatus;
        };
        bookingRequests.add(bookingId, updatedBooking);
      };
      case (null) { Runtime.trap("Booking not found for id " # bookingId.toText()) };
    };
  };

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

  public type ReferralBonus = {
    customerBonus : Nat;
    driverBonus : Nat;
  };

  let referralBonuses = Map.empty<Principal, ReferralBonus>();
  let referralCodes = Map.empty<Text, Principal>();
  let appliedReferrals = Map.empty<Principal, Principal>();

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

    switch (appliedReferrals.get(caller)) {
      case (?_) {
        Runtime.trap("Unauthorized: You have already applied a referral code");
      };
      case (null) { };
    };

    switch (referralCodes.get(code)) {
      case (?referrer) {
        if (referrer == caller) {
          Runtime.trap("Unauthorized: Cannot use your own referral code");
        };

        appliedReferrals.add(caller, referrer);
      };
      case (null) { Runtime.trap("Invalid referral code") };
    };
  };

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

        switch (appliedReferrals.get(referredUser)) {
          case (?referrer) {
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
          case (null) { };
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

  public type DriverBookingUpdate = {
    bookingId : Nat;
    status : BookingStatus;
    reason : ?Text;
  };

  public query ({ caller }) func getDriverDispatchBookings() : async [BookingRequestView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view dispatch bookings");
    };
    let driverBookings = List.empty<BookingRequest>();
    for (booking in bookingRequests.values()) {
      switch (booking.assigned_driver) {
        case (?driver) {
          if (driver == caller) {
            driverBookings.add(booking);
          };
        };
        case (null) {};
      };
    };
    let driverBookingsArray = driverBookings.toArray().map(func(b) { toBookingRequestView(b) });
    driverBookingsArray.sort(BookingRequestView.compareBookingRequestsById);
  };

  public query ({ caller }) func getDriverBookings() : async [BookingRequestView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their bookings");
    };
    let driverBookings = List.empty<BookingRequest>();
    for (booking in bookingRequests.values()) {
      switch (booking.assigned_driver) {
        case (?driver) {
          if (driver == caller) {
            driverBookings.add(booking);
          };
        };
        case (null) {};
      };
    };
    let driverBookingsArray = driverBookings.toArray().map(func(b) { toBookingRequestView(b) });
    driverBookingsArray.sort(BookingRequestView.compareBookingRequestsById);
  };

  public shared ({ caller }) func updateDriverBookingStatus(update : DriverBookingUpdate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update booking status");
    };
    switch (update.status) {
      case (#accepted) {};
      case (#refused) {};
      case (#completed) {};
      case (#cancelled) {};
      case (_) {
        Runtime.trap("Invalid status: Drivers can only set status to accepted, refused, completed, or cancelled");
      };
    };

    switch (bookingRequests.get(update.bookingId)) {
      case (?booking) {
        let isAssignedDriver = switch (booking.assigned_driver) {
          case (?driver) { driver == caller };
          case (null) { false };
        };

        if (not isAssignedDriver and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the assigned driver or admin can update this booking");
        };

        let updatedBooking = {
          booking with
          status = update.status;
          cancel_reason = update.reason;
        };
        bookingRequests.add(update.bookingId, updatedBooking);
      };
      case (null) { Runtime.trap("Booking request not found for id " # update.bookingId.toText()) };
    };
  };
};
