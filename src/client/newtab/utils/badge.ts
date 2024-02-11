interface BadgeOptions {
  url: string;
  title: string;
  showTitle: boolean;
  backgroundColor: string;
  size: number;
}

export function addBadge(parentElement: HTMLElement, opts: BadgeOptions): HTMLElement {
  const createdBadgeBundle = document.createElement("div");
  const createdBadge = document.createElement("div");
  const createdAnchor = document.createElement("a");

  createdBadgeBundle.style.display = "flex";
  createdBadgeBundle.style.flexDirection = "column";
  createdBadgeBundle.style.alignItems = "center";
  createdBadgeBundle.style.justifyContent = "center";

  createdAnchor.href = opts.url;

  createdBadge.style.marginBottom = "10px";
  createdBadge.style.width = `${opts.size}px`;
  createdBadge.style.height = `${opts.size}px`;
  createdBadge.style.borderRadius = "100%";
  createdBadge.style.backgroundColor = opts.backgroundColor;

  createdBadgeBundle.appendChild(createdBadge);
  createdBadgeBundle.appendChild(createdAnchor);

  if (opts.showTitle) {
    const createdTitle = document.createElement("span");

    createdTitle.innerText = opts.title;

    createdTitle.style.fontSize = "20px";
    createdTitle.style.fontWeight = "700";
    createdTitle.style.width = "min-width";

    createdBadgeBundle.appendChild(createdTitle);
  }

  parentElement.style.overflow = "scroll";

  parentElement.appendChild(createdBadgeBundle);

  return createdAnchor;
}
