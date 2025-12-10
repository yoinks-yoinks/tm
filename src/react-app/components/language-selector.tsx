import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Globe } from "lucide-react";

// Languages spoken in Balochistan, KPK, Gilgit-Baltistan regions of Pakistan
// Plus common languages used in Pakistan
export const SUPPORTED_LANGUAGES = [
  // Common/Official Languages
  { code: "en", name: "English", nativeName: "English", region: "Common" },
  { code: "ur", name: "Urdu", nativeName: "اردو", region: "Common" },
  
  // KPK (Khyber Pakhtunkhwa) Languages
  { code: "ps", name: "Pashto", nativeName: "پښتو", region: "KPK" },
  { code: "hi", name: "Hindko", nativeName: "ہندکو", region: "KPK" },
  { code: "sd", name: "Saraiki", nativeName: "سرائیکی", region: "KPK/Punjab" },
  
  // Balochistan Languages
  { code: "bal", name: "Balochi", nativeName: "بلوچی", region: "Balochistan" },
  { code: "brh", name: "Brahui", nativeName: "براہوئی", region: "Balochistan" },
  
  // Gilgit-Baltistan Languages
  { code: "bft", name: "Balti", nativeName: "བལྟི", region: "Gilgit-Baltistan" },
  { code: "scl", name: "Shina", nativeName: "شینا", region: "Gilgit-Baltistan" },
  { code: "bsk", name: "Burushaski", nativeName: "بروشسکی", region: "Gilgit-Baltistan" },
  { code: "khw", name: "Khowar", nativeName: "کھوار", region: "Gilgit-Baltistan/Chitral" },
  { code: "wbl", name: "Wakhi", nativeName: "وخی", region: "Gilgit-Baltistan" },
  
  // Punjab (additional)
  { code: "pa", name: "Punjabi", nativeName: "پنجابی", region: "Punjab" },
  
  // Sindh (additional)
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", region: "Sindh" },
] as const;

// Whisper supports these language codes - map regional languages to closest supported
export const WHISPER_LANGUAGE_MAP: Record<string, string> = {
  "en": "en",
  "ur": "ur",
  "ps": "ps",  // Pashto is directly supported
  "hi": "hi",  // Map Hindko to Hindi (closest)
  "sd": "sd",  // Sindhi is directly supported (also used for Saraiki)
  "bal": "fa", // Map Balochi to Persian (closest)
  "brh": "fa", // Map Brahui to Persian (closest)
  "bft": "bo", // Map Balti to Tibetan (closest)
  "scl": "ur", // Map Shina to Urdu (closest)
  "bsk": "ur", // Map Burushaski to Urdu (closest)
  "khw": "ur", // Map Khowar to Urdu (closest)
  "wbl": "fa", // Map Wakhi to Persian (closest)
  "pa": "pa",  // Punjabi is directly supported
};

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]["code"];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  disabled?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  compact = true,
  disabled = false,
}: LanguageSelectorProps) {
  const selectedLang = SUPPORTED_LANGUAGES.find((l) => l.code === value);
  
  // Group languages by region for better UX
  const groupedLanguages = SUPPORTED_LANGUAGES.reduce((acc, lang) => {
    if (!acc[lang.region]) {
      acc[lang.region] = [];
    }
    acc[lang.region].push(lang);
    return acc;
  }, {} as Record<string, typeof SUPPORTED_LANGUAGES[number][]>);

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex">
              <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger className="h-7 w-auto min-w-[70px] gap-1 border-none bg-transparent px-2 text-xs hover:bg-muted focus:ring-0">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <SelectValue>
                    {selectedLang?.code.toUpperCase() || "EN"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="end" className="max-h-[300px]">
                  {Object.entries(groupedLanguages).map(([region, languages]) => (
                    <div key={region}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {region}
                      </div>
                      {languages.map((lang) => (
                        <SelectItem
                          key={lang.code}
                          value={lang.code}
                          className="text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <span>{lang.name}</span>
                            <span className="text-muted-foreground text-xs">
                              {lang.nativeName}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Voice input language: {selectedLang?.name || "English"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select language">
          {selectedLang ? (
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{selectedLang.name}</span>
              <span className="text-muted-foreground">{selectedLang.nativeName}</span>
            </span>
          ) : (
            "Select language"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {Object.entries(groupedLanguages).map(([region, languages]) => (
          <div key={region}>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              {region}
            </div>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="flex items-center gap-2">
                  <span>{lang.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {lang.nativeName}
                  </span>
                </span>
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
