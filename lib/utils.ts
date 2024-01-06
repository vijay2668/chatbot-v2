import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const countries = [
  {
    label: "English",
    value: "english",
    image: "/countries/English.svg"
  },
  {
    label: "English (British)",
    value: "english_british",
    image: "/countries/English (British).svg"
  },
  {
    label: "Dutch",
    value: "dutch",
    image: "/countries/Dutch.svg"
  },
  {
    label: "French",
    value: "french",
    image: "/countries/French.svg"
  },
  {
    label: "German",
    value: "german",
    image: "/countries/German.svg"
  },
  {
    label: "Italian",
    value: "italian",
    image: "/countries/Italian.svg"
  },
  {
    label: "Polish",
    value: "polish",
    image: "/countries/Polish.svg"
  },
  {
    label: "Spanish",
    value: "spanish",
    image: "/countries/Spanish.svg"
  },
  {
    label: "Portuguese",
    value: "portuguese",
    image: "/countries/Portuguese.svg"
  },
  {
    label: "Portuguese (Brazilian)",
    value: "portuguese_brazilian",
    image: "/countries/Portuguese (Brazilian).svg"
  },
  {
    label: "Russian",
    value: "russian",
    image: "/countries/Russian.svg"
  },
  {
    label: "Japanese",
    value: "japanese",
    image: "/countries/Japanese.svg"
  },
  {
    label: "Chinese",
    value: "chinese",
    image: "/countries/Chinese.svg"
  },
  {
    label: "Bulgarian",
    value: "bulgarian",
    image: "/countries/Bulgarian.svg"
  },
  {
    label: "Czech",
    value: "czech",
    image: "/countries/Czech.svg"
  },
  {
    label: "Danish",
    value: "danish",
    image: "/countries/Danish.svg"
  },
  {
    label: "Greek",
    value: "greek",
    image: "/countries/Greek.svg"
  },
  {
    label: "Hungarian",
    value: "hungarian",
    image: "/countries/Hungarian.svg"
  },
  {
    label: "Lithuanian",
    value: "lithuanian",
    image: "/countries/Lithuanian.svg"
  },
  {
    label: "Latvian",
    value: "latvian",
    image: "/countries/Latvian.svg"
  },
  {
    label: "Romanian",
    value: "romanian",
    image: "/countries/Romanian.svg"
  },
  {
    label: "Slovak",
    value: "slovak",
    image: "/countries/Slovak.svg"
  },
  {
    label: "Slovenian",
    value: "slovenian",
    image: "/countries/Slovenian.svg"
  },
  {
    label: "Swedish",
    value: "swedish",
    image: "/countries/Swedish.svg"
  },
  {
    label: "Finnish",
    value: "finnish",
    image: "/countries/Finnish.svg"
  },
  {
    label: "Estonian",
    value: "estonian",
    image: "/countries/Estonian.svg"
  }
];
