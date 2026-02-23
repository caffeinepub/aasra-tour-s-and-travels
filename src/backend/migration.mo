import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {
  type OldBookingRequest = {
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
    status : {
      #pending;
      #accepted;
      #completed;
      #cancelled;
      #refused;
    };
    paymentMethod : Text;
    submitted_by : Principal;
    cancel_reason : ?Text;
    submit_time : Int;
    driver_rating : ?Nat;
    cab_rating : ?Nat;
    assigned_driver : ?Principal;
    driver_location : ?{
      latitude : Float;
      longitude : Float;
    };
  };

  type OldActor = {
    bookingRequests : Map.Map<Nat, OldBookingRequest>;
  };

  type NewBookingRequest = {
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
    status : {
      #pending;
      #accepted;
      #completed;
      #cancelled;
      #refused;
    };
    paymentMethod : Text;
    submitted_by : Principal;
    cancel_reason : ?Text;
    submit_time : Int;
    driver_rating : ?Nat;
    cab_rating : ?Nat;
    assigned_driver : ?Principal;
    driver_location : ?{
      latitude : Float;
      longitude : Float;
    };
    declined_by : List.List<Principal>;
  };

  type NewActor = {
    bookingRequests : Map.Map<Nat, NewBookingRequest>;
  };

  public func run(old : OldActor) : NewActor {
    let newBookings = old.bookingRequests.map<Nat, OldBookingRequest, NewBookingRequest>(
      func(_id, oldBooking) {
        { oldBooking with declined_by = List.empty<Principal>() };
      }
    );
    { bookingRequests = newBookings };
  };
};
