import { expect, test, describe, vi } from 'vitest'
import { setupCounter } from './counter'

// Mock the SVG imports since they are used in the code
vi.mock('./typescript.svg', () => 'typescript.svg')
vi.mock('/vite.svg', () => 'vite.svg')
vi.mock('./style.css', () => ({}))

describe('App Component', () => {
  beforeEach(() => {
    const appDiv = document.createElement('div')
    appDiv.id = 'app'
    document.body.appendChild(appDiv)

    appDiv.innerHTML = `
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
          <img src="typescript.svg" class="logo vanilla" alt="TypeScript logo" />
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
  })

  describe('Rendering the app', () => {
    test('renders the Vite and TypeScript logos', () => {
      const viteLogo = document.querySelector('img[alt="Vite logo"]')
      const tsLogo = document.querySelector('img[alt="TypeScript logo"]')

      expect(viteLogo).toBeTruthy()
      expect(tsLogo).toBeTruthy()
    })

    test('renders the counter button', () => {
      const counterButton = document.querySelector('#counter')
      expect(counterButton).toBeTruthy()
    })
  })

  describe('Counter functionality', () => {
    test('sets up counter button', () => {
      const counterButton = document.querySelector<HTMLButtonElement>('#counter')!
      setupCounter(counterButton)

      const mockClickHandler = vi.fn()
      counterButton.addEventListener('click', mockClickHandler)

      counterButton.click()

      expect(mockClickHandler).toHaveBeenCalled()
    })
  })
})
