import Button from "./Button.js";

export default class ListButton extends Button {
  #listButtonData;

  constructor(data, callback) {
    super(null, callback);

    this.#listButtonData = data;

    const divElement = document.createElement("div");
    const template = document.querySelector(".list-item");
    const templateClone = template.content.cloneNode(true);
    templateClone.querySelector("label").textContent = this.#listButtonData.name;
    divElement.appendChild(templateClone);

    this.setElement(divElement.children[0]);

    if (data.type === "folder") {
      const iconsContainer = divElement.querySelector(".toggle");
      iconsContainer.children[0].style.display = "initial";
    }
  }
}
