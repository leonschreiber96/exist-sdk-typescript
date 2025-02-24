/**
 * Profile information for a single user (see https://developer.exist.io/reference/object_types/#users).
 * This data is useful for customising the display of user data to the user's preferences.
 * → Use timezone to show times in the correct time zone for the user.
 * → Use the imperial_* flags to know which values to show in imperial units.
 */
export default interface UserProfile {
   username: string;
   first_name: string;
   last_name: string;
   avatar: string;
   timezone: string;
   local_time: Date;
   imperial_distance: boolean;
   imperial_weight: boolean;
   imperial_energy: boolean;
   imperial_liquid: boolean;
   imperial_temperature: boolean;
   trial: boolean;
   delinquent: boolean;
}
