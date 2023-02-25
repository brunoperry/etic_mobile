import Component from "./Component.js";

export default class RangeBar extends Component {
  #rangeInput;
  #rangeBar;

  constructor(elemID, callback) {
    super(elemID, callback);

    this.#rangeInput = this.element.querySelector("input[type='range']");
    this.#rangeBar = this.element.querySelector(".range-bar");

    this.#rangeInput.oninput = () => {
      const value = this.#rangeInput.value;
      this.#rangeBar.style.transform = `scaleX(${value / 100})`;
      this.callback(value);
    };

    const currentValue = parseFloat(this.#rangeInput.value);
    this.#rangeBar.style.transform = `scaleX(${currentValue / 100})`;
  }
}
