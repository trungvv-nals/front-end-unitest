import { setupCounter } from "../counter";

describe("setupCounter", () => {
  
  it("should initialize counter", () => {
    const button = document.createElement("button");
    setupCounter(button);
    expect(button.innerHTML).toBe("count is 0");
  });

  it("should increment counter when button is clicked", () => {
    const button = document.createElement("button");
    setupCounter(button);
    
    button.click();
    expect(button.innerHTML).toBe("count is 1");

    button.click();
    expect(button.innerHTML).toBe("count is 2");
  });

  it("should register click event listener", () => {
    const button = document.createElement("button");
    const addEventListenerSpy = vi.spyOn(button, "addEventListener");
    setupCounter(button);
    expect(addEventListenerSpy).toHaveBeenCalledWith("click", expect.any(Function));
  });

  it("should correctly handle multiple clicks", () => {
    const button = document.createElement("button");
    setupCounter(button);
    
    for (let i = 0; i < 5; i++) {
      button.click();
    }
    expect(button.innerHTML).toBe("count is 5");
  });

  it("should work independently for multiple buttons", () => {
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    setupCounter(button1);
    setupCounter(button2);
    
    button1.click();
    expect(button1.innerHTML).toBe("count is 1");
    expect(button2.innerHTML).toBe("count is 0");
  });
});
