import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  // Old types (without preferredPaymentMethod)
  type OldCustomerProfile = {
    name : Text;
  };

  type OldUserProfile = {
    #customer : OldCustomerProfile;
    #driver : {
      fullName : Text;
      cabNumber : Text;
      vehicleType : { #mini; #sedan; #suv; #premiumSuv };
      yearOfManufacture : Nat;
    };
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  // New types (with preferredPaymentMethod)
  type NewCustomerProfile = {
    name : Text;
    preferredPaymentMethod : ?{ #cash; #UPI; #creditCard; #debitCard };
  };

  type NewUserProfile = {
    #customer : NewCustomerProfile;
    #driver : {
      fullName : Text;
      cabNumber : Text;
      vehicleType : { #mini; #sedan; #suv; #premiumSuv };
      yearOfManufacture : Nat;
    };
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, oldProfile) {
        switch (oldProfile) {
          case (#customer(oldCustomer)) {
            #customer({
              name = oldCustomer.name;
              preferredPaymentMethod = null; // Default to null for existing users
            });
          };
          case (#driver(driver)) { #driver(driver) };
        };
      }
    );
    { userProfiles = newUserProfiles };
  };
};

