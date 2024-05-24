
import { Label } from "@repo/ui/label"
import { Input } from '@repo/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@repo/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"
import { Checkbox } from "@repo/ui/checkbox";
import { Combobox } from "@/components/combobox-font";

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface TextSettings {
  text: string | boolean;
  fontSize: number;
  fontFamily: string;
  margin: Margin;
  color: string;
}

interface CardDocumentSettingsProps {
  id: string;
  title: string;
  description: string;
  showText: boolean;
  certificateTextSettings: TextSettings;
  allowCapitalization?: boolean;
  allowMargin?: boolean;
  setCertificateTextSettings: (func: (prevSettings: TextSettings) => TextSettings) => void;
};

export function CardCustomText({
  id,
  title,
  description,
  showText,
  certificateTextSettings,
  allowMargin = true,
  setCertificateTextSettings,
  children,
}: CardDocumentSettingsProps & { children?: React.ReactNode }): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>&quot;{description}&quot;</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor={`certificate-text-${id}`}>Texto</Label>
            <Input
              className='my-2'
              disabled={!showText}
              id={`certificate-text-${id}`}
              onChange={(e) => {
                setCertificateTextSettings(prevSettings => ({
                  ...prevSettings,
                  text: e.target.value
                }));
              }}
              placeholder='Texto'
              value={certificateTextSettings.text.toString()}
            />
          </div>
          <div>
            <Label htmlFor={`font-size-${id}`}>Tamaño</Label>
            <Input
              className='my-2'
              disabled={!showText || !certificateTextSettings.text}
              id={`font-size-${id}`}
              min={1}
              onChange={(e) => {
                setCertificateTextSettings(prevSettings => ({
                  ...prevSettings,
                  fontSize: parseInt(e.target.value, 10)
                }));
              }}
              type='number'
              value={certificateTextSettings.fontSize}
            />
          </div>
          <div>
            <Label>Fuente</Label>
            <div className='my-2'>
              <Combobox
                disabled={!showText || !certificateTextSettings.text}
                setValue={(newFontFamily) => { setCertificateTextSettings(prevSettings => ({ ...prevSettings, fontFamily: newFontFamily })); }}
                value={certificateTextSettings.fontFamily}
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`color-${id}`}>Color</Label>
            <Input
              className='my-2 !p-0 !border-0'
              disabled={!showText || !certificateTextSettings.text}
              id={`color-${id}`}
              onChange={(e) => {
                setCertificateTextSettings(prevSettings => ({
                  ...prevSettings,
                  color: e.target.value
                }));
              }}
              type='color'
              value={certificateTextSettings.color}
            />
          </div>
        </div>
        {allowMargin ? (
          <div className='grid grid-cols-4 gap-4'>
            <div>
              <Label htmlFor={`margin-top-${id}`}>Margen superior</Label>
              <Input
                className='my-2'
                disabled={!showText || !certificateTextSettings.text}
                id={`margin-top-${id}`}
                min={0}
                onChange={(e) => {
                  setCertificateTextSettings(prevSettings => ({
                    ...prevSettings,
                    margin: {
                      ...prevSettings.margin,
                      top: parseInt(e.target.value, 10)
                    }
                  }));
                }}
                type='number'
                value={certificateTextSettings.margin.top}
              />
            </div>
            <div>
              <Label htmlFor={`margin-right-${id}`}>Margen derecho</Label>
              <Input
                className='my-2'
                disabled={!showText || !certificateTextSettings.text}
                id={`margin-right-${id}`}
                min={0}
                onChange={(e) => {
                  setCertificateTextSettings(prevSettings => ({
                    ...prevSettings,
                    margin: {
                      ...prevSettings.margin,
                      right: parseInt(e.target.value, 10)
                    }
                  }));
                }}
                type='number'
                value={certificateTextSettings.margin.right}
              />
            </div>
            <div>
              <Label htmlFor={`margin-bottom-${id}`}>Margen inferior</Label>
              <Input
                className='my-2'
                disabled={!showText || !certificateTextSettings.text}
                id={`margin-bottom-${id}`}
                min={0}
                onChange={(e) => {
                  setCertificateTextSettings(prevSettings => ({
                    ...prevSettings,
                    margin: {
                      ...prevSettings.margin,
                      bottom: parseInt(e.target.value, 10)
                    }
                  }));
                }}
                type='number'
                value={certificateTextSettings.margin.bottom}
              />
            </div>
            <div>
              <Label htmlFor={`margin-left-${id}`}>Margen izquierdo</Label>
              <Input
                className='my-2'
                disabled={!showText || !certificateTextSettings.text}
                id={`margin-left-${id}`}
                min={0}
                onChange={(e) => {
                  setCertificateTextSettings(prevSettings => ({
                    ...prevSettings,
                    margin: {
                      ...prevSettings.margin,
                      left: parseInt(e.target.value, 10)
                    }
                  }));
                }}
                type='number'
                value={certificateTextSettings.margin.left}
              />
            </div>
          </div>
        ) : null}
        {children}
      </CardContent>
    </Card>
  );
};

export function CardFixedText({
  id,
  title,
  description,
  showText,
  certificateTextSettings,
  allowCapitalization = true,
  allowMargin = true,
  setCertificateTextSettings,
  children,
}: CardDocumentSettingsProps & { children?: React.ReactNode }): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>&quot;{description}&quot;</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col items-center justify-center'>
            <Label htmlFor={`certificate-text-${id}`}>Mostrar</Label>
            <Checkbox
              checked={typeof certificateTextSettings.text === 'boolean' && certificateTextSettings.text}
              className='my-2'
              disabled={!showText}
              id={`certificate-text-${id}`}
              onCheckedChange={() => {
                setCertificateTextSettings(prevSettings => ({
                  ...prevSettings,
                  text: !prevSettings.text
                }));
              }}
            />
          </div>
          <div>
            <Label htmlFor={`font-size-${id}`}>Tamaño</Label>
            <Input
              className='my-2'
              disabled={!showText || !certificateTextSettings.text}
              id={`font-size-${id}`}
              min={1}
              onChange={(e) => {
                setCertificateTextSettings(prevSettings => ({
                  ...prevSettings,
                  fontSize: parseInt(e.target.value, 10)
                }));
              }}
              type='number'
              value={certificateTextSettings.fontSize}
            />
          </div>
          <div>
            <Label>Fuente</Label>
            <div className='my-2'>
              <Combobox
                disabled={!showText || !certificateTextSettings.text}
                setValue={(newFontFamily) => { setCertificateTextSettings(prevSettings => ({ ...prevSettings, fontFamily: newFontFamily })); }}
                value={certificateTextSettings.fontFamily}
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`color-${id}`}>Color</Label>
            <Input
              className='my-2 !p-0 !border-0'
              disabled={!showText || !certificateTextSettings.text}
              id={`color-${id}`}
              onChange={(e) => {
                setCertificateTextSettings(prevSettings => ({
                  ...prevSettings,
                  color: e.target.value
                }));
              }}
              type='color'
              value={certificateTextSettings.color}
            />
          </div>
        </div>
        {allowCapitalization ? (
          <div className='grid grid-cols-1 gap-4'>
            <div className='flex flex-col items-center justify-center'>
              <Label htmlFor={`capitalize-${id}`}>Uso de mayúsculas</Label>
              <Select onValueChange={(value: 'lowercase' | 'capitalize' | 'uppercase') => {
                setCertificateTextSettings(prevSettings => ({
                  ...prevSettings,
                  capitalization: value
                }));
              }}>
                <SelectTrigger className="my-2" disabled={!showText} id='events-format'>
                  <SelectValue placeholder="Uso de mayúsculas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lowercase">Minúsculas</SelectItem>
                  <SelectItem value="capitalize">Oración</SelectItem>
                  <SelectItem value="uppercase">Mayúsculas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}
        {allowMargin ? (
          <div className='grid grid-cols-4 gap-4'>
            <div>
              <Label htmlFor={`margin-top-${id}`}>Margen superior</Label>
              <Input
                className='my-2'
                disabled={!showText || !certificateTextSettings.text}
                id={`margin-top-${id}`}
                min={0}
                onChange={(e) => {
                  setCertificateTextSettings(prevSettings => ({
                    ...prevSettings,
                    margin: {
                      ...prevSettings.margin,
                      top: parseInt(e.target.value, 10)
                    }
                  }));
                }}
                type='number'
                value={certificateTextSettings.margin.top}
              />
            </div>
            <div>
              <Label htmlFor={`margin-right-${id}`}>Margen derecho</Label>
              <Input
                className='my-2'
                disabled={!showText || !certificateTextSettings.text}
                id={`margin-right-${id}`}
                min={0}
                onChange={(e) => {
                  setCertificateTextSettings(prevSettings => ({
                    ...prevSettings,
                    margin: {
                      ...prevSettings.margin,
                      right: parseInt(e.target.value, 10)
                    }
                  }));
                }}
                type='number'
                value={certificateTextSettings.margin.right}
              />
            </div>
            <div>
              <Label htmlFor={`margin-bottom-${id}`}>Margen inferior</Label>
              <Input
                className='my-2'
                disabled={!showText || !certificateTextSettings.text}
                id={`margin-bottom-${id}`}
                min={0}
                onChange={(e) => {
                  setCertificateTextSettings(prevSettings => ({
                    ...prevSettings,
                    margin: {
                      ...prevSettings.margin,
                      bottom: parseInt(e.target.value, 10)
                    }
                  }));
                }}
                type='number'
                value={certificateTextSettings.margin.bottom}
              />
            </div>
            <div>
              <Label htmlFor={`margin-left-${id}`}>Margen izquierdo</Label>
              <Input
                className='my-2'
                disabled={!showText || !certificateTextSettings.text}
                id={`margin-left-${id}`}
                min={0}
                onChange={(e) => {
                  setCertificateTextSettings(prevSettings => ({
                    ...prevSettings,
                    margin: {
                      ...prevSettings.margin,
                      left: parseInt(e.target.value, 10)
                    }
                  }));
                }}
                type='number'
                value={certificateTextSettings.margin.left}
              />
            </div>
          </div>
        ) : null}
        {children}
      </CardContent>
    </Card>
  );
};