import { mount, unmount } from 'svelte';
import App from './App.svelte';
import type { CardSheet } from './lib/types/protocol';

class KardamonGame extends HTMLElement {
    private app: ReturnType<typeof mount> | null = null;

    async connectedCallback() {
        this.style.display = 'block';
        this.style.height = '100%';

        const wsUrl = this.getAttribute('ws-url') ?? undefined;
        const sheetUrl = this.getAttribute('card-sheet-url') ?? undefined;

        let cardSheet: CardSheet | undefined;
        if (sheetUrl) {
            try {
                const res = await fetch(sheetUrl);
                const json = await res.json() as CardSheet;
                // Resolve 'image' relative to the JSON file's absolute URL.
                // sheetUrl may be a relative path ("/cards.json"), so resolve it
                // against the page first so new URL() has a valid absolute base.
                const absSheetUrl = new URL(sheetUrl, location.href).href;
                cardSheet = { ...json, image: new URL(json.image, absSheetUrl).href };
            } catch {
                // Sheet failed to load — Card falls back to text rendering.
            }
        }

        this.app = mount(App, {
            target: this,
            props: { wsUrl, cardSheet },
        });
    }

    disconnectedCallback() {
        if (this.app) {
            unmount(this.app);
            this.app = null;
        }
    }
}

customElements.define('kardamon-game', KardamonGame);
