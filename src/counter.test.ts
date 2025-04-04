import { describe, it, expect, vi } from 'vitest';
import { setupCounter } from './counter';

describe('setupCounter', () => {
  it('should initialize the counter to 0 and display it', () => {
    const button = document.createElement('button');
    setupCounter(button);
    expect(button.innerHTML).toBe('count is 0');
  });

  it('should increment the counter when the button is clicked', () => {
    const button = document.createElement('button');
    setupCounter(button);

    button.click();
    expect(button.innerHTML).toBe('count is 1');

    button.click();
    expect(button.innerHTML).toBe('count is 2');
  });

  it('should call the event listener when the button is clicked', () => {
    const button = document.createElement('button');
    const addEventListenerSpy = vi.spyOn(button, 'addEventListener');
    setupCounter(button);

    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });
});