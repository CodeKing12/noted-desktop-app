import { Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { FileTextIcon, Trash2Icon } from 'lucide-solid'

const emptyStyle = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	py: '12',
	px: '4',
	textAlign: 'center',
	animation: 'slide-up-fade 0.3s ease-out',
})

const iconStyle = css({
	width: '12',
	height: '12',
	color: 'gray.a5',
	mb: '4',
	strokeWidth: '1.25',
})

const titleStyle = css({
	fontSize: 'md',
	fontWeight: '500',
	color: 'fg.subtle',
	mb: '1.5',
	letterSpacing: '-0.01em',
})

const descStyle = css({
	fontSize: 'sm',
	color: 'fg.muted',
	mb: '5',
	lineHeight: '1.5',
})

const createBtn = css({
	px: '4',
	py: '2',
	borderRadius: 'lg',
	fontSize: 'sm',
	fontWeight: '500',
	cursor: 'pointer',
	bg: 'indigo.9',
	color: 'white',
	transition: 'all 0.15s',
	_hover: { bg: 'indigo.10', transform: 'translateY(-1px)', boxShadow: '0 4px 12px {colors.indigo.a5}' },
	_active: { transform: 'translateY(0)' },
})

const kbdHint = css({
	fontSize: 'xs',
	color: 'fg.muted',
	mt: '3',
	fontFamily: 'mono',
})

export function NoteListEmpty(props: {
	isTrash: boolean
	onCreateNote: () => void
}) {
	return (
		<div class={emptyStyle}>
			<Show
				when={!props.isTrash}
				fallback={
					<>
						<Trash2Icon class={iconStyle} />
						<p class={titleStyle}>Trash is empty</p>
						<p class={descStyle}>Deleted notes will appear here</p>
					</>
				}
			>
				<FileTextIcon class={iconStyle} />
				<p class={titleStyle}>No notes yet</p>
				<p class={descStyle}>Create your first note to get started</p>
				<button class={createBtn} onClick={props.onCreateNote}>
					Create Note
				</button>
				<span class={kbdHint}>or press Ctrl+K to search</span>
			</Show>
		</div>
	)
}
