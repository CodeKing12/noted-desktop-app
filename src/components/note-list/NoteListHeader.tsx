import { Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { PlusIcon } from 'lucide-solid'

const headerStyle = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	px: '4',
	py: '3',
	borderBottom: '1px solid',
	borderColor: 'border.default',
	flexShrink: 0,
})

const titleStyle = css({
	fontSize: 'sm',
	fontWeight: 'semibold',
	color: 'fg.default',
})

const addBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '7',
	height: '7',
	borderRadius: 'md',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	_hover: { bg: 'bg.muted', color: 'fg.default' },
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
