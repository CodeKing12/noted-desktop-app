import { Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { formatDate } from '../../lib/date-utils'
import { PinIcon } from 'lucide-solid'

const cardStyle = css({
	px: '3',
	py: '2.5',
	mx: '1',
	mb: '0.5',
	borderRadius: 'md',
	cursor: 'pointer',
	transition: 'all 0.15s',
	_hover: { bg: 'bg.muted' },
	'&[data-active="true"]': {
		bg: 'colorPalette.subtle.bg',
	},
})

const titleRow = css({
	display: 'flex',
	alignItems: 'center',
	gap: '1.5',
	mb: '0.5',
})

const titleStyle = css({
	fontSize: 'sm',
	fontWeight: 'medium',
	color: 'fg.default',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	flex: 1,
})

const previewStyle = css({
	fontSize: 'xs',
	color: 'fg.subtle',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	mb: '1',
})

const metaStyle = css({
	fontSize: 'xs',
	color: 'fg.muted',
})

const pinIcon = css({
	width: '3',
	height: '3',
	color: 'fg.subtle',
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
		if (plain) return plain.slice(0, 100)
		return ''
	}

	return (
		<div
			class={cardStyle}
			data-active={props.isActive}
			onClick={props.onClick}
		>
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
			<div class={metaStyle}>{formatDate(props.note.updated_at)}</div>
		</div>
	)
}
