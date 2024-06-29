/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
/* eslint-disable @typescript-eslint/no-confusing-void-expression -- . */
'use client';

import React, { useState, useEffect } from 'react';
import { Label } from "@repo/ui/label";
import {
	Dialog,
	DialogContent,
	DialogFooter,
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
import { Button } from '@repo/ui/button';
import { getDictionary } from '@/get-dictionary';

interface DialogDocumentSettingsProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["certificates"]["podium"]["document_settings"]["tiptap"]["dialogDocumentSettings"]
	pageOrientation: PageOrientation;
	setPageOrientation: (value: PageOrientation) => void;
	pageSize: PageSize;
	setPageSize: (value: PageSize) => void;
	pageMargins: Margins;
	setPageMargins: (value: Margins) => void;
}

export function DialogDocumentSettings({
	dictionary,
	pageOrientation,
	setPageOrientation,
	pageSize,
	setPageSize,
	pageMargins,
	setPageMargins
}: DialogDocumentSettingsProps): JSX.Element {
	const [open, setOpen] = useState(false);
	const [tempPageOrientation, setTempPageOrientation] = useState(pageOrientation);
	const [tempPageSize, setTempPageSize] = useState(pageSize);
	const [tempPageMargins, setTempPageMargins] = useState(pageMargins);

	useEffect(() => {
		setTempPageOrientation(pageOrientation);
		setTempPageSize(pageSize);
		setTempPageMargins(pageMargins);
	}, [pageOrientation, pageSize, pageMargins]);

	const handleSave = () => {
		setPageOrientation(tempPageOrientation);
		setPageSize(tempPageSize);
		setPageMargins(tempPageMargins);
	};

	return (
		<Dialog onOpenChange={(value) => setOpen(value)} open={open}>
			<DialogTrigger className='flex text-sm hover:bg-accent px-2 py-1.5 cursor-default rounded-sm w-full'>
				<FileText className='h-4 w-4 mr-2' />{dictionary.pageSettings}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{dictionary.pageSettings}</DialogTitle>
				</DialogHeader>
				<div className='grid grid-cols-2 gap-4'>
					<div className='flex flex-col gap-4'>
						<div className='grid gap-2'>
							<Label htmlFor='pageOrientation'>{dictionary.orientation}</Label>
							<RadioGroup className='flex' defaultValue="portrait" id='pageOrientation' onValueChange={(value: PageOrientation) => { setTempPageOrientation(value); }} value={tempPageOrientation}>
								<div className="flex items-center space-x-2">
									<RadioGroupItem id="portrait" value="portrait" />
									<Label htmlFor="portrait">{dictionary.portrait}</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem id="landscape" value="landscape" />
									<Label htmlFor="landscape">{dictionary.landscape}</Label>
								</div>
							</RadioGroup>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='pageSize'>{dictionary.paperSize}</Label>
							<Select onValueChange={(value: string) => { setTempPageSize(value as PageSize); }} value={tempPageSize as string}>
								<SelectTrigger className="w-full" id='pageSize'>
									<SelectValue placeholder={dictionary.size} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="LETTER">{dictionary.letter}</SelectItem>
									<SelectItem value="A4">{dictionary.a4}</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className='grid gap-2'>
						<Label htmlFor='pageMargins'>{dictionary.margins}</Label>
						<div className='grid items-center grid-cols-2 gap-2'>
							<Label htmlFor='top'>{dictionary.top}</Label>
							<Input
								className='w-full'
								id='top'
								max={200}
								min={0}
								onChange={(e) => {
									if (Array.isArray(tempPageMargins) && tempPageMargins.length === 4) {
										setTempPageMargins([
											tempPageMargins[0],
											parseInt(e.target.value),
											tempPageMargins[2],
											tempPageMargins[3]
										]);
									}
								}}
								type='number'
								value={Array.isArray(tempPageMargins) && tempPageMargins.length === 4 ? tempPageMargins[1] : 0}
							/>
							<Label htmlFor='bottom'>{dictionary.bottom}</Label>
							<Input
								className='w-full'
								id='bottom'
								max={200}
								min={0}
								onChange={(e) => {
									if (Array.isArray(tempPageMargins) && tempPageMargins.length === 4) {
										setTempPageMargins([
											tempPageMargins[0],
											tempPageMargins[1],
											tempPageMargins[2],
											parseInt(e.target.value)
										]);
									}
								}}
								type='number'
								value={Array.isArray(tempPageMargins) && tempPageMargins.length === 4 ? tempPageMargins[3] : 0}
							/>
							<Label htmlFor='right'>{dictionary.right}</Label>
							<Input
								className='w-full'
								id='right'
								max={200}
								min={0}
								onChange={(e) => {
									if (Array.isArray(tempPageMargins) && tempPageMargins.length === 4) {
										setTempPageMargins([
											tempPageMargins[0],
											tempPageMargins[1],
											parseInt(e.target.value),
											tempPageMargins[3]
										]);
									}
								}}
								type='number'
								value={Array.isArray(tempPageMargins) && tempPageMargins.length === 4 ? tempPageMargins[2] : 0}
							/>
							<Label htmlFor='left'>{dictionary.left}</Label>
							<Input
								className='w-full'
								id='left'
								max={200}
								min={0}
								onChange={(e) => {
									if (Array.isArray(tempPageMargins) && tempPageMargins.length === 4) {
										setTempPageMargins([
											parseInt(e.target.value),
											tempPageMargins[1],
											tempPageMargins[2],
											tempPageMargins[3]
										]);
									}
								}}
								type='number'
								value={Array.isArray(tempPageMargins) && tempPageMargins.length === 4 ? tempPageMargins[0] : 0}
							/>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={() => setOpen(false)} variant='secondary'>{dictionary.cancel}</Button>
					<Button onClick={handleSave}>{dictionary.save}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};