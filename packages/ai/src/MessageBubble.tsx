"use client";

import {Copy} from '@phosphor-icons/react';
import {CircleButton} from '@spacedrive/primitives';
import clsx from 'clsx';

import {Markdown} from './Markdown';

export interface MessageBubbleProps {
	content: string;
	isUser: boolean;
	isStreaming?: boolean;
	onCopy?: (content: string) => void;
}

export function MessageBubble({
	content,
	isUser,
	isStreaming = false,
	onCopy
}: MessageBubbleProps) {
	return (
		<div
			className={clsx(
				'group flex flex-col py-2',
				isUser ? 'items-end' : 'items-start'
			)}
		>
			<div
				className={clsx(
					'max-w-[80%] rounded-2xl text-sm leading-6',
					isUser
						? 'bg-accent px-4 py-1 text-white'
						: 'text-ink border border-none bg-transparent'
				)}
			>
				{isUser ? (
					<div className="whitespace-pre-wrap break-words">{content}</div>
				) : (
					<Markdown content={content} className="break-words" />
				)}
			</div>
			{!isUser && onCopy ? (
				<div className="mt-2 flex opacity-0 transition-opacity duration-150 group-hover:opacity-100">
					<CircleButton
						icon={Copy}
						onClick={() => onCopy(content)}
						aria-label={
							isStreaming ? 'Copy Streaming Message' : 'Copy Message'
						}
						title={
							isStreaming ? 'Copy streaming message' : 'Copy message'
						}
						className="h-7 w-7"
					/>
				</div>
			) : null}
		</div>
	);
}
