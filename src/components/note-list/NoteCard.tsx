import { Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { formatDate } from '../../lib/date-utils'
import { PinIcon } from 'lucide-solid'

const cardStyle = css({
	position: 'relative',
	px: '3',
	py: '2.5',
	mx: '1.5',
	mb: '1',
	borderRadius: 'lg',
	cursor: 'pointer',
	transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
	border: '1px solid transparent',
	animation: 'card-enter 0.25s ease-out both',
	_hover: {
		bg: 'gray.a2',
		borderColor: 'gray.a3',
		transform: 'translateY(-1px)',
		boxShadow: '0 2px 8px {colors.gray.a3}',
	},
	'&[data-active="true"]': {
		bg: 'indigo.a2',
		borderColor: 'indigo.a4',
		'& .accent-bar': {
			opacity: 1,
			transform: 'scaleY(1)',
		},
	},
})

const accentBar = css({
	position: 'absolute',
	left: 0,
	top: '20%',
	bottom: '20%',
	width: '3px',
	borderRadius: 'full',
	bg: 'indigo.9',
	opacity: 0,
	transform: 'scaleY(0)',
	transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
})

const titleRow = css({
	display: 'flex',
	alignItems: 'center',
	gap: '1.5',
	mb: '1',
})

const titleStyle = css({
	fontSize: 'sm',
	fontWeight: '500',
	color: 'fg.default',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	flex: 1,
	letterSpacing: '-0.01em',
})

const previewStyle = css({
	fontSize: 'xs',
	color: 'fg.subtle',
	overflow: 'hidden',
	display: '-webkit-box',
	WebkitLineClamp: 2,
	WebkitBoxOrient: 'vertical',
	lineHeight: '1.5',
	mb: '1.5',
})

const metaRow = css({
	display: 'flex',
	alignItems: 'center',
	gap: '1.5',
})

const metaStyle = css({
	fontSize: '11px',
	color: 'fg.muted',
	fontWeight: '400',
})

const pinIcon = css({
	width: '3',
	height: '3',
	color: 'indigo.9',
	flexShrink: 0,
})

export function NoteCard(props: {
	note: Note
	isActive: boolean
	onClick: () => void
	isTrash?: boolean
}) {
	const preview = () => {
		const plain = props.note.content_plain
		if (plain) return plain.slice(0, 160)
		return ''
	}

	return (
		<div
			class={cardStyle}
			data-active={props.isActive}
			onClick={props.onClick}
		>
			<div class={`accent-bar ${accentBar}`} />
			<div class={titleRow}>
				<span class={titleStyle}>
					{props.note.title || 'Untitled'}
				</span>
				<Show when={props.note.is_pinned}>
					<PinIcon class={pinIcon} />
				</Show>
			</div>
			<Show when={preview()}>
				<div class={previewStyle}>{preview()}</div>
			</Show>
			<div class={metaRow}>
				<span class={metaStyle}>{formatDate(props.note.updated_at)}</span>
			</div>
		</div>
	)
}
