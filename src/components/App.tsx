import { AppStoreProvider } from '../stores/app-store'
import { EditorStoreProvider } from '../stores/editor-store'
import { SettingsStoreProvider } from '../stores/settings-store'
import { AppShell } from './layout/AppShell'
import { SettingsDialog } from './settings/SettingsDialog'

export default function App() {
	return (
		<AppStoreProvider>
			<EditorStoreProvider>
				<SettingsStoreProvider>
					<AppShell />
					<SettingsDialog />
				</SettingsStoreProvider>
			</EditorStoreProvider>
		</AppStoreProvider>
	)
}
