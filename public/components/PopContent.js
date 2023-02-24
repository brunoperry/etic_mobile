import Component from "./Component.js";
import { Globals } from "../script.js";

export default class PopContent extends Component {
  #timeoutID = null;
  #content;

  container;
  content;
  isOpened = false;
  constructor(elemID) {
    super(elemID);

    this.container = this.getElement(`${elemID}-container`);
    this.content = this.getElement(`.content`);
  }

  open() {
    if (this.isOpened) return;
    this.#clearAnims();
    this.container.style.transform = `scaleY(1)`;

    this.#timeoutID = setTimeout(() => {
      this.onchange("opened");
      this.content.style.display = "flex";
    }, Globals.SPEED * 1000);
    this.isOpened = true;

    this.onchange("open");
  }

  close() {
    if (!this.isOpened) return;
    this.#clearAnims();
    this.content.style.display = "none";
    this.container.style.transform = `scaleY(0)`;
    this.isOpened = false;

    this.onchange("closed");
  }

  #clearAnims() {
    if (this.#timeoutID) {
      clearTimeout(this.#timeoutID);
      this.#timeoutID = null;
    }
  }
}
