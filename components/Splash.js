export default class Splash {
  #element;

  constructor() {
    this.#element = document.querySelector("#splash");
  }

  error() {
    const p = this.#element.querySelector("p");
    const path = this.#element.querySelector("path");

    path.style.animationName = "none";
    path.style.fill = "var(--error-color)";
    p.innerText = "Error connecting to server.";
    p.style.color = "var(--error-color)";
  }

  delete() {
    document.body.removeChild(this.#element);
  }
}
