import { PinnedLinks } from "@src/types/user";

interface BadgeOptions extends PinnedLinks {
  showTitle: boolean;
}

export function addBadge(parentElement: HTMLElement, opts: BadgeOptions): HTMLElement {
  const createdBadgeBundle = document.createElement("a");
  const createdBadge = document.createElement("div");
  const createdAnchor = document.createElement("a");

  createdBadgeBundle.href = opts.url;
  createdBadgeBundle.style.display = "flex";
  createdBadgeBundle.style.flexDirection = "column";
  createdBadgeBundle.style.alignItems = "center";
  createdBadgeBundle.style.justifyContent = "center";

  createdBadge.style.marginBottom = "10px";
  createdBadge.style.width = "90px";
  createdBadge.style.height = "90px";
  createdBadge.style.borderRadius = "100%";
  createdBadge.style.backgroundColor = opts.majorColour;

  createdBadgeBundle.appendChild(createdBadge);

  if (opts.showTitle) {
    const createdTitle = document.createElement("span");

    createdTitle.innerText = opts.name;

    createdTitle.style.fontSize = "20px";
    createdTitle.style.fontWeight = "700";
    createdTitle.style.width = "min-width";

    createdBadgeBundle.appendChild(createdTitle);
  }

  parentElement.appendChild(createdBadgeBundle);

  return createdAnchor;
}
