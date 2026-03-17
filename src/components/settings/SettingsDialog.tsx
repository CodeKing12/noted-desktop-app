import { Show } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useSettingsStore } from '../../stores/settings-store'
import { XIcon } from 'lucide-solid'

const overlay = css({
	position: 'fixed',
	inset: 0,
	bg: 'rgba(0,0,0,0.4)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 50,
})

const dialog = css({
	bg: 'bg.default',
	borderRadius: 'lg',
	width: '480px',
	maxHeight: '80vh',
	overflow: 'auto',
	boxShadow: 'lg',
	border: '1px solid',
	borderColor: 'border.default',
})

const dialogHeader = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	px: '6',
	py: '4',
	borderBottom: '1px solid',
	borderColor: 'border.default',
})

const dialogTitle = css({
	fontSize: 'md',
	fontWeight: 'semibold',
	color: 'fg.default',
})

const closeBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '7',
	height: '7',
	borderRadius: 'md',
	cursor: 'pointer',
	color: 'fg.subtle',
	_hover: { bg: 'bg.muted', color: 'fg.default' },
})

const body = css({
	px: '6',
	py: '5',
})

const settingRow = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	py: '3',
	borderBottom: '1px solid',
	borderColor: 'border.default',
	_last: { borderBottom: 'none' },
})

const settingLabel = css({
	fontSize: 'sm',
	fontWeight: 'medium',
	color: 'fg.default',
})

const settingDesc = css({
	fontSize: 'xs',
	color: 'fg.subtle',
	mt: '0.5',
})

const selectStyle = css({
	px: '3',
	py: '1.5',
	borderRadius: 'md',
	border: '1px solid',
	borderColor: 'border.default',
	bg: 'bg.default',
	color: 'fg.default',
	fontSize: 'sm',
	outline: 'none',
	cursor: 'pointer',
	_focus: { borderColor: 'colorPalette.solid.bg' },
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
								<div class={settingLabel}>Theme</div>
								<div class={settingDesc}>
									Toggle between light and dark mode
								</div>
							</div>
							<button
								class={css({
									px: '3',
									py: '1.5',
									borderRadius: 'md',
									fontSize: 'sm',
									cursor: 'pointer',
									bg: 'bg.muted',
									color: 'fg.default',
									_hover: { bg: 'bg.emphasized' },
								})}
								onClick={() =>
									window.electronAPI.darkModeToggle()
								}
							>
								Toggle
							</button>
						</div>
					</div>
				</div>
			</div>
		</Show>
	)
}
