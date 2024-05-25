/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import { Font } from '@react-pdf/renderer';

export const setupFonts = () => {
  Font.register({
    family: 'MavenPro', fonts: [
      { src: '/fonts/MavenPro/MavenPro-Regular.ttf' },
      { src: '/fonts/MavenPro/MavenPro-Bold.ttf', fontWeight: 'bold' },
    ]
  });
  Font.register({
    family: 'YoungSerif', fonts: [
      { src: '/fonts/YoungSerif/YoungSerif-Regular.ttf' },
    ]
  });
  Font.register({
    family: 'ABeeZee', fonts: [
      { src: 'http://fonts.gstatic.com/s/abeezee/v9/JYPhMn-3Xw-JGuyB-fEdNA.ttf' },
    ]
  });

  Font.registerHyphenationCallback(word => [word]);
};

export const fonts = [
  {
    value: "Courier",
    label: "Courier",
  },
  {
    value: "Helvetica",
    label: "Helvetica",
  },
  {
    value: "Times-Roman",
    label: "Times New Roman",
  },
  {
    value: "MavenPro",
    label: "Maven Pro",
  },
  {
    value: "YoungSerif",
    label: "Young Serif",
  },
  {
    value: "AbeeZee",
    label: "AbeeZee",
  },
]