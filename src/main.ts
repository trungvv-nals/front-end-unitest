import './style.css';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.ts';

export const appHTML = `
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
      </a>
      <h1>Vite + TypeScript</h1>
      <div class="card">
        <button id="counter" type="button"></button>
      </div>
      <p class="read-the-docs">
        Click on the Vite and TypeScript logos to learn more
      </p>
    </div>
  `

export function createAppHTML(): string {
  return appHTML;
}

export function initializeApp(): void {
  const appElement = document.querySelector<HTMLDivElement>('#app');
  if (!appElement) {
    throw new Error('App root element not found');
  }

  appElement.innerHTML = createAppHTML();
  const counterButton = appElement.querySelector<HTMLButtonElement>('#counter');

  setupCounter(counterButton!);
}

// Initialize the application
initializeApp();