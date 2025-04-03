import { describe, it, expect, vi } from 'vitest';
import { setupCounter } from './counter';

describe('setupCounter', () => {
  it('should initialize the counter to 0', () => {
    const button = document.createElement('button');
    setupCounter(button);
    expect(button.innerHTML).toBe('count is 0');
  });

  it('should increment the counter on button click', () => {
    const button = document.createElement('button');
    setupCounter(button);

    // Simulate a button click
    button.click();
    expect(button.innerHTML).toBe('count is 1');

    // Simulate another button click
    button.click();
    expect(button.innerHTML).toBe('count is 2');
  });

  it('should attach a click event listener to the button', () => {
    const button = document.createElement('button');
    const addEventListenerSpy = vi.spyOn(button, 'addEventListener');
    setupCounter(button);

    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });
});