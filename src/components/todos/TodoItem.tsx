import { css } from '../../../styled-system/css'
import { useAppStore } from '../../stores/app-store'
import { Trash2Icon } from 'lucide-solid'

const itemStyle = css({
	display: 'flex',
	alignItems: 'center',
	gap: '3',
	px: '3',
	py: '2',
	borderRadius: 'md',
	transition: 'all 0.15s',
	_hover: { bg: 'bg.muted' },
	'&:hover .todo-delete': { opacity: 1 },
})

const checkbox = css({
	width: '4',
	height: '4',
	accentColor: 'var(--colors-color-palette-solid-bg)',
	cursor: 'pointer',
	flexShrink: 0,
})

const textStyle = css({
	flex: 1,
	fontSize: 'sm',
	color: 'fg.default',
	'&[data-completed="true"]': {
		textDecoration: 'line-through',
		color: 'fg.muted',
	},
})

const dueDateStyle = css({
	fontSize: 'xs',
	color: 'fg.subtle',
	flexShrink: 0,
	'&[data-overdue="true"]': {
		color: 'red.text',
	},
})

const deleteBtn = css({
	opacity: 0,
	transition: 'opacity 0.15s',
	cursor: 'pointer',
	color: 'fg.subtle',
	_hover: { color: 'red.text' },
	display: 'flex',
	alignItems: 'center',
})

export function TodoItem(props: { todo: Todo }) {
	const store = useAppStore()

	async function handleToggle() {
		await window.electronAPI.updateTodo(props.todo.id, {
			is_completed: !props.todo.is_completed,
		})
		store.refetchTodos()
	}

	async function handleDelete() {
		await window.electronAPI.deleteTodo(props.todo.id)
		store.refetchTodos()
	}

	const isOverdue = () => {
		if (!props.todo.due_date || props.todo.is_completed) return false
		return props.todo.due_date < new Date().toISOString().split('T')[0]
	}

	return (
		<div class={itemStyle}>
			<input
				type="checkbox"
				class={checkbox}
				checked={!!props.todo.is_completed}
				onChange={handleToggle}
			/>
			<span
				class={textStyle}
				data-completed={!!props.todo.is_completed}
			>
				{props.todo.text}
			</span>
			{props.todo.due_date && (
				<span class={dueDateStyle} data-overdue={isOverdue()}>
					{props.todo.due_date}
				</span>
			)}
			<span class={`todo-delete ${deleteBtn}`} onClick={handleDelete}>
				<Trash2Icon class={css({ width: '3.5', height: '3.5' })} />
			</span>
		</div>
	)
}
