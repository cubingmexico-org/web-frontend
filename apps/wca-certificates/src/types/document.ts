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
  capitalizaion?: 'uppercase' | 'lowercase' | 'capitalize';
}