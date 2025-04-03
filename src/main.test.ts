import { describe, it, expect, vi } from "vitest";
import { setupCounter } from "./counter.ts";
import "./main.ts";
import { appHTML, createAppHTML, initializeApp } from "./main.ts";

vi.mock("./counter.ts", () => ({
  setupCounter: vi.fn(),
}));

describe("main.ts", () => {
  describe("createAppHTML", () => {
    it("should return the correct HTML structure", () => {
      const result = createAppHTML();
      expect(result).toBe(appHTML);
    });
  });

  describe("initializeApp", () => {
    it("should throw an error if the #app element is not found", () => {
      document.body.innerHTML = ""; // Remove the #app element
      expect(initializeApp).toThrowError("App root element not found");
    });

    it("should call setupCounter with the counter button", () => {
      const appEl = document.createElement("div");
      appEl.id = "app";
      appEl.innerHTML = appHTML;
      document.body.appendChild(appEl);

      initializeApp();

      const counterButton = appEl.querySelector<HTMLButtonElement>("#counter");
      expect(counterButton).not.toBeNull();
      expect(setupCounter).toHaveBeenCalledWith(counterButton);
    });
  });
});
