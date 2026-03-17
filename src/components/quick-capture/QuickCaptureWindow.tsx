import { createSignal } from 'solid-js'
import { css } from '../../../styled-system/css'

const container = css({
	display: 'flex',
	flexDirection: 'column',
	height: '100vh',
	p: '4',
	bg: 'bg.default',
})

const header = css({
	fontSize: 'sm',
	fontWeight: 'semibold',
	color: 'fg.default',
	mb: '3',
})

const textarea = css({
	flex: 1,
	resize: 'none',
	border: '1px solid',
	borderColor: 'border.default',
	borderRadius: 'md',
	px: '3',
	py: '2',
	bg: 'bg.default',
	color: 'fg.default',
	fontSize: 'sm',
	outline: 'none',
	lineHeight: '1.6',
	_focus: { borderColor: 'colorPalette.solid.bg' },
	'&::placeholder': { color: 'fg.muted' },
})

const footer = css({
	display: 'flex',
	justifyContent: 'flex-end',
	gap: '2',
	mt: '3',
})

const btn = css({
	px: '3',
	py: '1.5',
	borderRadius: 'md',
	fontSize: 'sm',
	fontWeight: 'medium',
	cursor: 'pointer',
})

export default function QuickCaptureWindow() {
	const [text, setText] = createSignal('')

	async function handleSubmit() {
		const value = text().trim()
		if (!value) return
		await window.electronAPI.submitQuickCapture(value)
		setText('')
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			handleSubmit()
		}
		if (e.key === 'Escape') {
			window.close()
		}
	}

	return (
		<div class={container}>
			<div class={header}>Quick Capture</div>
			<textarea
				class={textarea}
				value={text()}
				onInput={(e) => setText(e.currentTarget.value)}
				onKeyDown={handleKeyDown}
				placeholder="Jot something down... (Ctrl+Enter to save)"
				autofocus
			/>
			<div class={footer}>
				<button
					class={`${btn} ${css({
						bg: 'colorPalette.solid.bg',
						color: 'colorPalette.solid.fg',
						_hover: { bg: 'colorPalette.solid.bg.hover' },
					})}`}
					onClick={handleSubmit}
				>
					Save Note
				</button>
			</div>
		</div>
	)
}
