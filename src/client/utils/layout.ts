export function addLayout(name: string): HTMLElement | false {
  const main = document.body.querySelector("main");

  if (!main) return false;

  const foundLayout = document.body.querySelector(`#layout-${name}`);

  if (foundLayout) return false;

  const createdLayout = document.createElement("section");

  createdLayout.setAttribute("id", `layout-${name}`);

  const createdTitle = document.createElement("h2");
  createdTitle.innerText = name.charAt(0).toUpperCase() + name.slice(1);

  createdLayout.appendChild(createdTitle);

  const layoutBundle = document.createElement("div");

  layoutBundle.style.display = "grid";
  layoutBundle.style.gap = "50px";

  function resizeHandler() {
    let offset = 0;

    if (window.innerWidth < 350) {
      offset = 1;
    } else if (window.innerWidth < 500) {
      offset = 2;
    } else if (window.innerWidth < 650) {
      offset = 3;
    } else {
      offset = 4;
    }

    layoutBundle.style.gridTemplateColumns = `repeat(${offset}, minmax(0, 1fr))`;
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
