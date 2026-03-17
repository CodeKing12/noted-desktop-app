import { Show, createSignal } from 'solid-js'
import { css } from '../../../styled-system/css'
import { useSettingsStore } from '../../stores/settings-store'
import {
	XIcon,
	SunIcon,
	MoonIcon,
	MonitorIcon,
	TypeIcon,
	FileTextIcon,
	PaletteIcon,
	InfoIcon,
	ChevronDownIcon,
} from 'lucide-solid'

// ─── Overlay + shell ──────────────────────────────────────

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
	bg: 'gray.2',
	borderRadius: 'lg',
	width: '520px',
	maxHeight: '80vh',
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	boxShadow: '0 24px 64px -8px rgba(0, 0, 0, 0.4), 0 0 0 1px {colors.gray.a3}',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'gray.a3',
	animation: 'modal-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
})

// ─── Header ───────────────────────────────────────────────

const dialogHeader = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	px: '6',
	py: '5',
	borderBottom: '1px solid',
	borderBottomColor: 'gray.a2',
})

const headerLeft = css({
	display: 'flex',
	flexDirection: 'column',
	gap: '1',
})

const dialogTitle = css({
	fontSize: '18px',
	fontWeight: '700',
	color: 'fg.default',
	letterSpacing: '-0.02em',
})

const dialogSubtitle = css({
	fontSize: '13px',
	color: 'fg.muted',
})

const closeBtn = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '8',
	height: '8',
	borderRadius: 'md',
	cursor: 'pointer',
	color: 'fg.subtle',
	transition: 'all 0.15s',
	_hover: { bg: 'gray.a3', color: 'fg.default' },
})

// ─── Body ─────────────────────────────────────────────────

const body = css({
	flex: 1,
	overflow: 'auto',
	px: '6',
	py: '5',
})

const sectionTitle = css({
	display: 'flex',
	alignItems: 'center',
	gap: '2',
	fontSize: '12px',
	fontWeight: '700',
	color: 'fg.subtle',
	textTransform: 'uppercase',
	letterSpacing: '0.05em',
	mb: '3',
})

const sectionIcon = css({
	width: '3.5',
	height: '3.5',
})

const sectionDivider = css({
	height: '1px',
	bg: 'gray.a2',
	my: '5',
})

// ─── Setting rows ─────────────────────────────────────────

const settingRow = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: '4',
	py: '3',
})

const settingInfo = css({
	flex: 1,
})

const settingLabel = css({
	fontSize: '14px',
	fontWeight: '500',
	color: 'fg.default',
	letterSpacing: '-0.01em',
})

const settingDesc = css({
	fontSize: '12px',
	color: 'fg.muted',
	mt: '1',
	lineHeight: '1.5',
})

// ─── Controls ─────────────────────────────────────────────

const selectWrap = css({
	position: 'relative',
	display: 'inline-flex',
	alignItems: 'center',
})

const selectControl = css({
	appearance: 'none',
	px: '4',
	pr: '9',
	py: '2',
	borderRadius: 'md',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: 'gray.a4',
	bg: 'gray.a2',
	color: 'fg.default',
	fontSize: '13px',
	fontWeight: '500',
	outline: 'none',
	cursor: 'pointer',
	minWidth: '140px',
	transition: 'all 0.15s',
	_hover: { borderColor: 'gray.a5', bg: 'gray.a3' },
	_focus: { borderColor: 'indigo.a6', boxShadow: '0 0 0 3px {colors.indigo.a2}' },
})

const selectChevron = css({
	position: 'absolute',
	right: '10px',
	pointerEvents: 'none',
	width: '3.5',
	height: '3.5',
	color: 'fg.subtle',
})

const themeGroup = css({
	display: 'flex',
	gap: '2',
})

const themeOption = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '1.5',
	px: '4',
	py: '3',
	borderRadius: 'md',
	cursor: 'pointer',
	borderWidth: '2px',
	borderStyle: 'solid',
	borderColor: 'gray.a3',
	transition: 'all 0.15s',
	color: 'fg.muted',
	_hover: { borderColor: 'gray.a5', bg: 'gray.a2' },
	'&[data-active="true"]': {
		borderColor: 'indigo.9',
		bg: 'indigo.a2',
		color: 'indigo.11',
	},
})

const themeOptionIcon = css({
	width: '5',
	height: '5',
})

const themeOptionLabel = css({
	fontSize: '11px',
	fontWeight: '600',
})

// ─── Footer ───────────────────────────────────────────────

const footer = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '1.5',
	px: '6',
	py: '4',
	borderTop: '1px solid',
	borderTopColor: 'gray.a2',
	fontSize: '12px',
	color: 'fg.subtle',
})

export function SettingsDialog() {
	const settings = useSettingsStore()
	const [currentTheme, setCurrentTheme] = createSignal<'light' | 'dark' | 'system'>('system')

	function handleThemeChange(theme: 'light' | 'dark' | 'system') {
		setCurrentTheme(theme)
		if (theme === 'system') {
			window.electronAPI.darkModeSystem()
		} else {
			window.electronAPI.darkModeUpdate(theme)
		}
	}

	return (
		<Show when={settings.showSettingsDialog()}>
			<div
				class={overlay}
				onClick={() => settings.setShowSettingsDialog(false)}
			>
				<div class={dialog} onClick={(e) => e.stopPropagation()}>
					{/* Header */}
					<div class={dialogHeader}>
						<div class={headerLeft}>
							<span class={dialogTitle}>Settings</span>
							<span class={dialogSubtitle}>Customize your Notes experience</span>
						</div>
						<button
							class={closeBtn}
							onClick={() => settings.setShowSettingsDialog(false)}
						>
							<XIcon class={css({ width: '4', height: '4' })} />
						</button>
					</div>

					{/* Body */}
					<div class={body}>
						{/* Appearance section */}
						<div class={sectionTitle}>
							<PaletteIcon class={sectionIcon} />
							Appearance
						</div>

						<div class={settingRow}>
							<div class={settingInfo}>
								<div class={settingLabel}>Theme</div>
								<div class={settingDesc}>
									Choose how Notes looks to you
								</div>
							</div>
							<div class={themeGroup}>
								<div
									class={themeOption}
									data-active={currentTheme() === 'light'}
									onClick={() => handleThemeChange('light')}
								>
									<SunIcon class={themeOptionIcon} />
									<span class={themeOptionLabel}>Light</span>
								</div>
								<div
									class={themeOption}
									data-active={currentTheme() === 'dark'}
									onClick={() => handleThemeChange('dark')}
								>
									<MoonIcon class={themeOptionIcon} />
									<span class={themeOptionLabel}>Dark</span>
								</div>
								<div
									class={themeOption}
									data-active={currentTheme() === 'system'}
									onClick={() => handleThemeChange('system')}
								>
									<MonitorIcon class={themeOptionIcon} />
									<span class={themeOptionLabel}>System</span>
								</div>
							</div>
						</div>

						<div class={sectionDivider} />

						{/* Editor section */}
						<div class={sectionTitle}>
							<TypeIcon class={sectionIcon} />
							Editor
						</div>

						<div class={settingRow}>
							<div class={settingInfo}>
								<div class={settingLabel}>Default note type</div>
								<div class={settingDesc}>
									New notes will open with this editor
								</div>
							</div>
							<div class={selectWrap}>
								<select
									class={selectControl}
									value={settings.defaultNoteType()}
									onChange={(e) =>
										settings.setDefaultNoteType(
											e.currentTarget.value as 'rich' | 'plain'
										)
									}
								>
									<option value="rich">Rich Text</option>
									<option value="plain">Plain Text</option>
								</select>
								<ChevronDownIcon class={selectChevron} />
							</div>
						</div>

						<div class={sectionDivider} />

						{/* About section */}
						<div class={sectionTitle}>
							<InfoIcon class={sectionIcon} />
							About
						</div>

						<div class={settingRow}>
							<div class={settingInfo}>
								<div class={settingLabel}>Version</div>
								<div class={settingDesc}>
									Notes — a minimal, distraction-free note-taking app
								</div>
							</div>
							<span class={css({ fontSize: '13px', color: 'fg.muted', fontWeight: '500' })}>
								1.0.0
							</span>
						</div>
					</div>

					{/* Footer */}
					<div class={footer}>
						<FileTextIcon class={css({ width: '3.5', height: '3.5' })} />
						<span>Made with care</span>
					</div>
				</div>
			</div>
		</Show>
	)
}
