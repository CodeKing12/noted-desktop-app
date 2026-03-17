import {
	createContext,
	useContext,
	createSignal,
	onMount,
	type ParentProps,
} from 'solid-js'

interface SettingsStore {
	defaultNoteType: () => 'rich' | 'plain'
	setDefaultNoteType: (v: 'rich' | 'plain') => void
	showSettingsDialog: () => boolean
	setShowSettingsDialog: (v: boolean) => void
}

const SettingsStoreContext = createContext<SettingsStore>()

export function SettingsStoreProvider(props: ParentProps) {
	const [defaultNoteType, _setDefaultNoteType] = createSignal<'rich' | 'plain'>(
		'rich'
	)
	const [showSettingsDialog, setShowSettingsDialog] = createSignal(false)

	onMount(async () => {
		const saved = await window.electronAPI.getSetting('defaultNoteType')
		if (saved === 'plain' || saved === 'rich') {
			_setDefaultNoteType(saved)
		}
	})

	function setDefaultNoteType(v: 'rich' | 'plain') {
		_setDefaultNoteType(v)
		window.electronAPI.setSetting('defaultNoteType', v)
	}

	const store: SettingsStore = {
		defaultNoteType,
		setDefaultNoteType,
		showSettingsDialog,
		setShowSettingsDialog,
	}

	return (
		<SettingsStoreContext.Provider value={store}>
			{props.children}
		</SettingsStoreContext.Provider>
	)
}

export function useSettingsStore(): SettingsStore {
	const ctx = useContext(SettingsStoreContext)
	if (!ctx)
		throw new Error(
			'useSettingsStore must be used within SettingsStoreProvider'
		)
	return ctx
}
