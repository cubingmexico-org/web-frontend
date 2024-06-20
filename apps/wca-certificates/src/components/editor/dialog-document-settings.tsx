import React from 'react';
import { Label } from "@repo/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/dialog"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from '@repo/ui/select';
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group"
import { Input } from '@repo/ui/input';
import type { Margins, PageOrientation, PageSize } from 'pdfmake/interfaces';
import { FileText } from 'lucide-react';

interface DialogDocumentSettingsProps {
	pageOrientation: PageOrientation;
	setPageOrientation: (value: PageOrientation) => void;
	pageSize: PageSize;
	setPageSize: (value: PageSize) => void;
	pageMargins: Margins;
	setPageMargins: (value: Margins) => void;
}

export function DialogDocumentSettings({
	pageOrientation,
	setPageOrientation,
	pageSize,
	setPageSize,
	pageMargins,
	setPageMargins
}: DialogDocumentSettingsProps): JSX.Element {
	return (
		<Dialog>
			<DialogTrigger className='flex text-sm hover:bg-accent px-2 py-1.5 cursor-default rounded-sm'>
				<FileText className='h-4 w-4 mr-2' />Configuración de página
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Configuración de página</DialogTitle>
					<div className='grid grid-cols-2 gap-4'>
						<div className='flex flex-col gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='pageOrientation'>Orientación</Label>
								<RadioGroup className='flex' defaultValue="portrait" id='pageOrientation' onValueChange={(value: PageOrientation) => { setPageOrientation(value); }} value={pageOrientation}>
									<div className="flex items-center space-x-2">
										<RadioGroupItem id="portrait" value="portrait" />
										<Label htmlFor="portrait">Vertical</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem id="landscape" value="landscape" />
										<Label htmlFor="landscape">Horizontal</Label>
									</div>
								</RadioGroup>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='pageSize'>Tamaño de papel</Label>
								<Select onValueChange={(value: string) => { setPageSize(value as PageSize); }} value={pageSize as string}>
									<SelectTrigger className="w-full" id='pageSize'>
										<SelectValue placeholder="Tamaño *" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="LETTER">Carta (21.6 cm x 27.9 cm)</SelectItem>
										<SelectItem value="A4">A4 (21 cm x 29.7 cm)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='pageMargins'>Márgenes</Label>
							<div className='grid items-center grid-cols-2 gap-2'>
								<Label htmlFor='top'>Superior</Label>
								<Input
									className='w-full'
									disabled
									id='top'
									min={0}
									onChange={(e) => {
										if (Array.isArray(pageMargins) && pageMargins.length === 4) {
											setPageMargins([
												pageMargins[0],
												parseInt(e.target.value),
												pageMargins[2],
												pageMargins[3]
											]);
										}
									}}
									type='number'
									value={Array.isArray(pageMargins) && pageMargins.length === 4 ? pageMargins[1] : 0}
								/>
								<Label htmlFor='bottom'>Inferior</Label>
								<Input
									className='w-full'
									disabled
									id='bottom'
									min={0}
									onChange={(e) => {
										if (Array.isArray(pageMargins) && pageMargins.length === 4) {
											setPageMargins([
												pageMargins[0],
												pageMargins[1],
												pageMargins[2],
												parseInt(e.target.value)
											]);
										}
									}}
									type='number'
									value={Array.isArray(pageMargins) && pageMargins.length === 4 ? pageMargins[3] : 0}
								/>
								<Label htmlFor='right'>Derecho</Label>
								<Input
									className='w-full'
									disabled
									id='right'
									min={0}
									onChange={(e) => {
										if (Array.isArray(pageMargins) && pageMargins.length === 4) {
											setPageMargins([
												pageMargins[0],
												pageMargins[1],
												parseInt(e.target.value),
												pageMargins[3]
											]);
										}
									}}
									type='number'
									value={Array.isArray(pageMargins) && pageMargins.length === 4 ? pageMargins[2] : 0}
								/>
								<Label htmlFor='left'>Izquierdo</Label>
								<Input
									className='w-full'
									disabled
									id='left'
									min={0}
									onChange={(e) => {
										if (Array.isArray(pageMargins) && pageMargins.length === 4) {
											setPageMargins([
												parseInt(e.target.value),
												pageMargins[1],
												pageMargins[2],
												pageMargins[3]
											]);
										}
									}}
									type='number'
									value={Array.isArray(pageMargins) && pageMargins.length === 4 ? pageMargins[0] : 0}
								/>
							</div>
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
