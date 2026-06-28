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
                // Resolve 'image' relative to the JSON file so the integrator can
                // use a relative path in the JSON without worrying about the page URL.
                cardSheet = { ...json, image: new URL(json.image, sheetUrl).href };
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
