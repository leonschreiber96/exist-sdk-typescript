enum ReadScope {
   ACTIVITY = "activity_read",
   PRODUCTIVITY = "productivity_read",
   MOOD = "mood_read",
   SLEEP = "sleep_read",
   WORKOUTS = "workouts_read",
   EVENTS = "events_read",
   FINANCE = "finance_read",
   FOOD = "food_read",
   HEALTH = "health_read",
   LOCATION = "location_read",
   MEDIA = "media_read",
   SOCIAL = "social_read",
   WEATHER = "weather_read",
   CUSTOM = "custom_read",
   MANUAL = "manual_read",
}

enum WriteScope {
   ACTIVITY = "activity_write",
   PRODUCTIVITY = "productivity_write",
   MOOD = "mood_write",
   SLEEP = "sleep_write",
   WORKOUTS = "workouts_write",
   EVENTS = "events_write",
   FINANCE = "finance_write",
   FOOD = "food_write",
   HEALTH = "health_write",
   LOCATION = "location_write",
   MEDIA = "media_write",
   SOCIAL = "social_write",
   WEATHER = "weather_write",
   CUSTOM = "custom_write",
   MANUAL = "manual_write",
}

type Scope = ReadScope | WriteScope;

export { ReadScope, WriteScope };
export type { Scope };