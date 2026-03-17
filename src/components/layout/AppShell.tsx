import { Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { Sidebar } from './Sidebar'
import { NoteList } from './NoteList'
import { EditorPane } from './EditorPane'
import { TodoView } from '../todos/TodoView'
import { useAppStore } from '../../stores/app-store'

const shellStyle = css({
	display: 'flex',
	height: '100vh',
	width: '100vw',
	overflow: 'hidden',
	bg: 'bg.canvas',
})

const sidebarStyle = css({
	width: '220px',
	minWidth: '220px',
	borderRight: '1px solid',
	borderColor: 'border.default',
	display: 'flex',
	flexDirection: 'column',
	bg: 'bg.subtle',
	overflow: 'hidden',
})

const noteListStyle = css({
	width: '300px',
	minWidth: '250px',
	borderRight: '1px solid',
	borderColor: 'border.default',
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
})

const editorStyle = css({
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	minWidth: 0,
})

export function AppShell() {
	const store = useAppStore()

	const isTodoView = () => store.currentView() === 'todos'

	return (
		<div class={shellStyle}>
			<div class={sidebarStyle}>
				<Sidebar />
			</div>
			<Show
				when={!isTodoView()}
				fallback={
					<div class={editorStyle}>
						<TodoView />
					</div>
				}
			>
				<div class={noteListStyle}>
					<NoteList />
				</div>
				<div class={editorStyle}>
					<EditorPane />
				</div>
			</Show>
		</div>
	)
}
