/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 */

import initApp, { attachShortcuts } from "./app";

window.onload = async () => {
  initApp();
  attachShortcuts();
};
