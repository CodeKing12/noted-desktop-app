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
})

const iconStyle = css({
	width: '10',
	height: '10',
	color: 'fg.muted',
	mb: '3',
})

const titleStyle = css({
	fontSize: 'sm',
	fontWeight: 'medium',
	color: 'fg.subtle',
	mb: '1',
})

const descStyle = css({
	fontSize: 'xs',
	color: 'fg.muted',
	mb: '4',
})

const createBtn = css({
	px: '3',
	py: '1.5',
	borderRadius: 'md',
	fontSize: 'xs',
	fontWeight: 'medium',
	cursor: 'pointer',
	bg: 'colorPalette.solid.bg',
	color: 'colorPalette.solid.fg',
	transition: 'all 0.15s',
	_hover: { bg: 'colorPalette.solid.bg.hover' },
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
			</Show>
		</div>
	)
}
