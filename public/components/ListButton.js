import Button from "./Button.js";

export default class ListButton extends Button {
  #stateIcon = 0;
  data;
  constructor(data) {
    super();
    this.data = data;

    const divElement = document.createElement("div");

    const template = document.querySelector("template");
    const liClone = template.content.cloneNode(true);
    liClone.querySelector("label").innerText = data.name;
    divElement.appendChild(liClone);

    this.setElement(divElement.children[0]);
    if (data.children) this.toggle(0);
  }

  toggle(index) {
    const toggles = this.view.querySelector(".icons").children;
    toggles[this.#stateIcon].style.display = "none";
    this.#stateIcon = index;
    toggles[this.#stateIcon].style.display = "flex";
  }
}
