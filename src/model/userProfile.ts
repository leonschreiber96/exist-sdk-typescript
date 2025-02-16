type UserProfile = {
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
};

export type { UserProfile };