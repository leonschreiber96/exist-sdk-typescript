import type AttributeValueType from "./attributeValueType.ts";

enum AttributeTemplateId {
   // Activity
   Steps = "steps",
   StepsActiveMin = "steps_active_min",
   StepsElevation = "steps_elevation",
   Floors = "floors",
   StepsDistance = "steps_distance",
   StandHours = "stand_hours",
   CycleMin = "cycle_min",
   CycleDistance = "cycle_distance",
   ActiveEnergy = "active_energy",

   // Workouts
   Workouts = "workouts",
   WorkoutsMin = "workouts_min",
   WorkoutsDistance = "workouts_distance",

   // Productivity
   ProductiveMin = "productive_min",
   NeutralMin = "neutral_min",
   DistractingMin = "distracting_min",
   Commits = "commits",
   TasksCompleted = "tasks_completed",
   WordsWritten = "words_written",
   EmailsSent = "emails_sent",
   EmailsReceived = "emails_received",
   PomodorosMin = "pomodoros_min",
   Keystrokes = "keystrokes",

   // Food and Drink
   Coffees = "coffees",
   AlcoholicDrinks = "alcoholic_drinks",
   Energy = "energy",
   Water = "water",
   Carbohydrates = "carbohydrates",
   Fat = "fat",
   Fibre = "fibre",
   Protein = "protein",
   Sugar = "sugar",
   Sodium = "sodium",
   Cholesterol = "cholesterol",
   Caffeine = "caffeine",

   // Finance
   MoneySpent = "money_spent",

   // Mood
   Mood = "mood",
   MoodNote = "mood_note",
   EnergyLevel = "energy_level",
   StressLevel = "stress_level",

   // Sleep
   Sleep = "sleep",
   TimeInBed = "time_in_bed",
   SleepLight = "sleep_light",
   SleepDeep = "sleep_deep",
   SleepRem = "sleep_rem",
   SleepStart = "sleep_start",
   SleepEnd = "sleep_end",
   SleepAwakenings = "sleep_awakenings",

   // Events
   Events = "events",
   EventsDuration = "events_duration",

   // Health
   Weight = "weight",
   BodyFat = "body_fat",
   LeanMass = "lean_mass",
   Heartrate = "heartrate",
   HeartrateMax = "heartrate_max",
   HeartrateVariability = "heartrate_variability",
   HeartrateResting = "heartrate_resting",
   MeditationMin = "meditation_min",
   MenstrualFlow = "menstrual_flow",
   SexualActivity = "sexual_activity",

   // Location
   Checkins = "checkins",
   Location = "location",

   // Media
   Tracks = "tracks",
   ArticlesRead = "articles_read",
   PagesRead = "pages_read",
   MobileScreenMin = "mobile_screen_min",
   GamingMin = "gaming_min",
   TvMin = "tv_min",

   // Social
   FacebookPosts = "facebook_posts",
   FacebookComments = "facebook_comments",
   FacebookReactions = "facebook_reactions",
   Tweets = "tweets",
   TwitterMentions = "twitter_mentions",
   TwitterUsername = "twitter_username",

   // Weather
   WeatherTempMax = "weather_temp_max",
   WeatherTempMin = "weather_temp_min",
   WeatherPrecipitation = "weather_precipitation",
   WeatherCloudCover = "weather_cloud_cover",
   WeatherWindSpeed = "weather_wind_speed",
   WeatherSummary = "weather_summary",
   WeatherIcon = "weather_icon",
   DayLength = "day_length",
}

type AttributeTemplate = {
   name: AttributeTemplateId;
   label: string;
   group: {
      name: string;
      label: string;
      priority: number;
   };
   priority: number;
   value_type: AttributeValueType;
   value_type_description: string;
}

export type { AttributeTemplate, AttributeTemplateId };