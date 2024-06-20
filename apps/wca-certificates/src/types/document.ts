export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface TextSettings {
  text: string | boolean;
  fontSize: number;
  fontFamily: string;
  margin: Margin;
  color: string;
  capitalization?: 'uppercase' | 'lowercase' | 'capitalize';
}

export interface DocumentState {
  size: "LETTER" | "A4" | undefined;
  orientation: "portrait" | "landscape" | undefined;
  fontFamily: string;
  color: string;
  margins: Margin;
  showUpperText: boolean;
  upperMargins: Margin;
  upperText1: TextSettings;
  upperText2: TextSettings;
  upperText3: TextSettings;
  upperText4: TextSettings;
  showMiddleText: boolean;
  middleText1: TextSettings;
  middleText2: TextSettings;
  middleText3: TextSettings;
  middleText4: TextSettings;
  placesFormat: 'place' | 'medal' | 'other'
  showLowerText: boolean;
  lowerMargins: Margin;
  lowerText1: TextSettings;
  lowerText2: TextSettings;
  lowerText3: TextSettings;
  lowerText4: TextSettings;
  lowerText5: TextSettings;
  lowerText6: TextSettings;
  lowerText7: TextSettings;
  lowerText8: TextSettings;
  lowerText9: TextSettings;
  lowerText10: TextSettings;
  lowerText11: TextSettings;
  lowerText12: TextSettings;
  lowerText13: TextSettings;
  lowerText14: TextSettings;
  showTable: boolean;
  tableMargins: Margin;
  tableText1: TextSettings;
  tableText2: TextSettings;
  tableText3: TextSettings;
  tableText4: TextSettings;
  tableText5: TextSettings;
  tableText6: TextSettings;
  eventsFormat: "en" | "es" | undefined;
}