export function addLayout(name: string, title?: string): HTMLElement | false {
  const main = document.body.querySelector("main");

  if (!main) return false;

  const foundLayout = document.body.querySelector(`#layout-${name}`);

  if (foundLayout) return false;

  const createdLayout = document.createElement("section");

  createdLayout.setAttribute("id", `layout-${name}`);

  if (title) {
    const createdTitle = document.createElement("h2");
    createdTitle.innerText = title;

    createdLayout.appendChild(createdTitle);
  }

  const layoutBundle = document.createElement("div");

  layoutBundle.style.display = "grid";
  layoutBundle.style.gap = "50px";

  function resizeHandler() {
    if (window.innerWidth < 350) {
      layoutBundle.style.gridTemplateColumns = "repeat(1, minmax(0, 1fr))";
    } else if (window.innerWidth < 500) {
      layoutBundle.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    } else if (window.innerWidth < 650) {
      layoutBundle.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
    } else {
      layoutBundle.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
    }
  }

  window.addEventListener("resize", resizeHandler);

  resizeHandler();

  createdLayout.appendChild(layoutBundle);

  main.appendChild(createdLayout);

  return layoutBundle;
}

export function removeLayout(name: string): HTMLElement | false {
  const foundLayout = document.body.querySelector(`#layout-${name}`) as HTMLElement;

  if (foundLayout) {
    foundLayout.remove();

    return foundLayout;
  } else return false;
}

export function showElement(currentElement: HTMLElement) {
  currentElement.style.display = "block";
}

export function hideElement(currentElement: HTMLElement) {
  currentElement.style.display = "none";
}
