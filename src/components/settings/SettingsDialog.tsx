import { Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useSettingsStore } from '../../stores/settings-store'
import { XIcon } from 'lucide-solid'

const overlay = css({
	position: 'fixed',
	inset: 0,
	bg: 'rgba(0,0,0,0.5)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 50,
	animation: 'overlay-enter 0.15s ease-out',
})

const dialog = css({
	bg: 'bg.default',
	borderRadius: 'xl',
	width: '480px',
	maxHeight: '80vh',
	overflow: 'auto',
	boxShadow: '0 24px 64px -8px rgba(0, 0, 0, 0.35), 0 0 0 1px {colors.gray.a3}',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'gray.a4',
	animation: 'modal-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
})

const dialogHeader = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	px: '6',
	py: '4',
	borderBottom: '1px solid',
	borderBottomColor: 'gray.a3',
})

const dialogTitle = css({
	fontSize: 'md',
	fontWeight: '600',
	color: 'fg.default',
	letterSpacing: '-0.01em',
})

const closeBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '7',
	height: '7',
	borderRadius: 'lg',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	_hover: { bg: 'gray.a3', color: 'fg.default' },
})

const body = css({
	px: '6',
	py: '5',
})

const settingRow = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	py: '4',
	borderBottom: '1px solid',
	borderBottomColor: 'gray.a3',
	_last: { borderBottom: 'none' },
})

const settingLabel = css({
	fontSize: 'sm',
	fontWeight: '500',
	color: 'fg.default',
})

const settingDesc = css({
	fontSize: 'xs',
	color: 'fg.muted',
	mt: '0.5',
	lineHeight: '1.4',
})

const selectStyle = css({
	px: '3',
	py: '1.5',
	borderRadius: 'lg',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'gray.a4',
	bg: 'bg.default',
	color: 'fg.default',
	fontSize: 'sm',
	outline: 'none',
	cursor: 'pointer',
	transition: 'all 0.15s',
	_focus: { borderColor: 'indigo.a6', boxShadow: '0 0 0 3px {colors.indigo.a2}' },
})

const toggleBtn = css({
	px: '3',
	py: '1.5',
	borderRadius: 'lg',
	fontSize: 'sm',
	fontWeight: '500',
	cursor: 'pointer',
	bg: 'gray.a3',
	color: 'fg.default',
	transition: 'all 0.15s',
	_hover: { bg: 'gray.a4' },
})

export function SettingsDialog() {
	const settings = useSettingsStore()

	return (
		<Show when={settings.showSettingsDialog()}>
			<div
				class={overlay}
				onClick={() => settings.setShowSettingsDialog(false)}
			>
				<div class={dialog} onClick={(e) => e.stopPropagation()}>
					<div class={dialogHeader}>
						<span class={dialogTitle}>Settings</span>
						<button
							class={closeBtn}
							onClick={() => settings.setShowSettingsDialog(false)}
						>
							<XIcon class={css({ width: '4', height: '4' })} />
						</button>
					</div>
					<div class={body}>
						<div class={settingRow}>
							<div>
								<div class={settingLabel}>
									Default note type
								</div>
								<div class={settingDesc}>
									Choose the default editor for new notes
								</div>
							</div>
							<select
								class={selectStyle}
								value={settings.defaultNoteType()}
								onChange={(e) =>
									settings.setDefaultNoteType(
										e.currentTarget.value as
											| 'rich'
											| 'plain'
									)
								}
							>
								<option value="rich">Rich Text</option>
								<option value="plain">Plain Text</option>
							</select>
						</div>
						<div class={settingRow}>
							<div>
								<div class={settingLabel}>Appearance</div>
								<div class={settingDesc}>
									Toggle between light and dark mode
								</div>
							</div>
							<button
								class={toggleBtn}
								onClick={() =>
									window.electronAPI.darkModeToggle()
								}
							>
								Toggle Theme
							</button>
						</div>
					</div>
				</div>
			</div>
		</Show>
	)
}
