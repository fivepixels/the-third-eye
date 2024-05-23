/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 * Content Scripts - Index
 */

import initApp, { attachShortcuts } from "./app";

window.onload = async () => {
  initApp();
  attachShortcuts();
};
