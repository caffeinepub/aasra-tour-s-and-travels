import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type OldUserProfile = {
    name : Text;
  };

  type NewUserProfile = {
    #customer : { name : Text };
    #driver : {
      fullName : Text;
      cabNumber : Text;
      vehicleType : {
        #mini;
        #sedan;
        #suv;
        #premiumSuv;
      };
      yearOfManufacture : Nat;
    };
  };

  public func run(old : { userProfiles : Map.Map<Principal, OldUserProfile> }) : { userProfiles : Map.Map<Principal, NewUserProfile> } {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldUserProfile) {
        #customer { name = oldUserProfile.name };
      }
    );
    { userProfiles = newUserProfiles };
  };
};
