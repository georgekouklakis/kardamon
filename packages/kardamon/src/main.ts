import { mount } from 'svelte';
import App from './App.svelte';
import './app.css';
import cardSheetJson from '../public/cards.json';
import type { CardSheet } from './lib/types/protocol';

// public/ assets are served at root by Vite, so resolve image relative to origin.
const cardSheet: CardSheet = {
    ...(cardSheetJson as CardSheet),
    image: new URL(cardSheetJson.image, window.location.origin).href,
};

const app = mount(App, { target: document.getElementById('app')!, props: { cardSheet } });

export default app;
