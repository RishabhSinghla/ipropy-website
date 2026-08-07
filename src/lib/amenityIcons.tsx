import {
  Waves, Dumbbell, Building2, Baby, Trees, Footprints, Gamepad2, LayoutGrid, Drama, Flower2,
  BatteryCharging, ArrowUpDown, CarFront, Car, ShieldCheck, Camera, Phone, Siren, CloudRain,
  Recycle, Sun, Zap, ConciergeBell, Coffee, Briefcase, Users, PawPrint, Trophy, BookOpen, Sparkles,
  CheckCircle2, type LucideIcon,
} from "lucide-react";

// Matches the CRM's AMENITIES constant (packages/shared/src/constants.ts) —
// falls back to a plain checkmark for anything added there later.
const AMENITY_ICONS: Record<string, LucideIcon> = {
  "Swimming Pool": Waves,
  "Gymnasium": Dumbbell,
  "Clubhouse": Building2,
  "Children Play Area": Baby,
  "Landscaped Garden": Trees,
  "Jogging Track": Footprints,
  "Indoor Games": Gamepad2,
  "Multipurpose Hall": LayoutGrid,
  "Amphitheatre": Drama,
  "Yoga Deck": Flower2,
  "Power Backup": BatteryCharging,
  "Lift": ArrowUpDown,
  "Covered Parking": CarFront,
  "Visitor Parking": Car,
  "24x7 Security": ShieldCheck,
  "CCTV Surveillance": Camera,
  "Intercom": Phone,
  "Fire Safety": Siren,
  "Rainwater Harvesting": CloudRain,
  "Sewage Treatment Plant": Recycle,
  "Solar Panels": Sun,
  "EV Charging": Zap,
  "Concierge": ConciergeBell,
  "Cafeteria": Coffee,
  "Business Centre": Briefcase,
  "Senior Citizen Deck": Users,
  "Pet Park": PawPrint,
  "Sports Court": Trophy,
  "Library": BookOpen,
  "Spa": Sparkles,
};

export function amenityIcon(amenity: string): LucideIcon {
  return AMENITY_ICONS[amenity] ?? CheckCircle2;
}
