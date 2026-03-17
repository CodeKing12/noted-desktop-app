import { Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { PlusIcon } from 'lucide-solid'

const headerStyle = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	px: '4',
	py: '3.5',
	flexShrink: 0,
})

const titleStyle = css({
	fontSize: 'sm',
	fontWeight: '600',
	color: 'fg.default',
	letterSpacing: '-0.01em',
})

const addBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '7',
	height: '7',
	borderRadius: 'lg',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	_hover: { bg: 'indigo.a3', color: 'indigo.11' },
})

export function NoteListHeader(props: {
	title: string
	onCreateNote: () => void
	showCreate: boolean
}) {
	return (
		<div class={headerStyle}>
			<span class={titleStyle}>{props.title}</span>
			<Show when={props.showCreate}>
				<button class={addBtn} onClick={props.onCreateNote} title="New note">
					<PlusIcon class={css({ width: '4', height: '4' })} />
				</button>
			</Show>
		</div>
	)
}
