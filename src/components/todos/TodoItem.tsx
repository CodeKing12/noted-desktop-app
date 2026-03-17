import { css } from '../../../styled-system/css'
import { useAppStore } from '../../stores/app-store'
import { Trash2Icon } from 'lucide-solid'
import { formatDate } from '../../lib/date-utils'

const itemStyle = css({
	display: 'flex',
	alignItems: 'center',
	gap: '3',
	px: '3',
	py: '2.5',
	borderRadius: 'lg',
	transition: 'all 0.15s',
	_hover: { bg: 'gray.a2' },
	'&:hover .todo-delete': { opacity: 1 },
})

const checkboxWrap = css({
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
})

const checkbox = css({
	width: '18px',
	height: '18px',
	accentColor: 'var(--colors-indigo-9)',
	cursor: 'pointer',
	borderRadius: 'sm',
	transition: 'transform 0.15s',
	'&:checked': {
		animation: 'check-bounce 0.3s ease',
	},
})

const textStyle = css({
	flex: 1,
	fontSize: 'sm',
	color: 'fg.default',
	transition: 'all 0.2s',
	lineHeight: '1.5',
	'&[data-completed="true"]': {
		textDecoration: 'line-through',
		color: 'fg.muted',
	},
})

const dueDateStyle = css({
	fontSize: '11px',
	fontWeight: '500',
	color: 'fg.muted',
	flexShrink: 0,
	'&[data-overdue="true"]': {
		color: 'red.9',
	},
})

const deleteBtn = css({
	opacity: 0,
	transition: 'all 0.15s',
	cursor: 'pointer',
	color: 'fg.subtle',
	_hover: { color: 'red.9' },
	display: 'flex',
	alignItems: 'center',
	padding: '1',
	borderRadius: 'md',
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
			<div class={checkboxWrap}>
				<input
					type="checkbox"
					class={checkbox}
					checked={!!props.todo.is_completed}
					onChange={handleToggle}
				/>
			</div>
			<span
				class={textStyle}
				data-completed={!!props.todo.is_completed}
			>
				{props.todo.text}
			</span>
			{props.todo.due_date && (
				<span class={dueDateStyle} data-overdue={isOverdue()}>
					{formatDate(props.todo.due_date)}
				</span>
			)}
			<span class={`todo-delete ${deleteBtn}`} onClick={handleDelete}>
				<Trash2Icon class={css({ width: '3.5', height: '3.5' })} />
			</span>
		</div>
	)
}
