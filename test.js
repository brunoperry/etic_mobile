const obj = {
  id: "no",
  children: [
    {
      id: "no",
      chidlren: [
        {
          id: "no",
          children: [{ id: "yes" }],
        },
      ],
    },
  ],
};

class Test extends HTMLElement {
  constructor() {
    super();
    console.log(this);
  }
}
