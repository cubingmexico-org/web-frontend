/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import { Font } from '@react-pdf/renderer';

export const setupFonts = () => {
  Font.register({
    family: 'MavenPro', fontStyle: 'normal', fonts: [
      { src: '/fonts/MavenPro/MavenPro-Regular.ttf', fontWeight: 'normal'},
      { src: '/fonts/MavenPro/MavenPro-Bold.ttf', fontWeight: 'bold'},
    ]
  });

  Font.registerHyphenationCallback(word => [word]);
};

export const fonts = [
  {
    value: "Roboto",
    label: "Roboto",
  },
  {
    value: "Maven Pro",
    label: "Maven Pro",
  },
]