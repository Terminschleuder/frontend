# Third-party notices

This project is licensed under the Apache License 2.0 — see [LICENSE](LICENSE).
This file is the inventory of third-party software it builds on: the npm
dependencies declared in `package.json` (exact versions from
`package-lock.json`) and the base images. Versions below reflect the current
lock state; licenses are taken from the npm registry.

## Runtime dependencies (bundled into the built SPA)

| Library | Version | License | Upstream |
| --- | --- | --- | --- |
| @tanstack/react-query | 5.101.4 | MIT | https://tanstack.com/query |
| @tanstack/react-query-devtools | 5.101.4 | MIT | https://tanstack.com/query |
| class-variance-authority | 0.7.1 | Apache-2.0 | https://github.com/joe-bell/cva |
| clsx | 2.1.1 | MIT | https://github.com/lukeed/clsx |
| date-fns | 4.4.0 | MIT | https://github.com/date-fns/date-fns |
| leaflet | 1.9.4 | BSD-2-Clause | https://leafletjs.com/ |
| react | 19.2.8 | MIT | https://react.dev/ |
| react-dom | 19.2.8 | MIT | https://react.dev/ |
| react-leaflet | 5.0.0 | Hippocratic-2.1 | https://react-leaflet.js.org |
| react-router-dom | 7.18.2 | MIT | https://github.com/remix-run/react-router |
| sonner | 2.0.8 | MIT | https://sonner.emilkowal.ski/ |
| tailwind-merge | 3.6.0 | MIT | https://github.com/dcastil/tailwind-merge |
| zod | 4.4.3 | MIT | https://zod.dev |

> **Note on `react-leaflet`:** it is distributed under the
> [Hippocratic License 2.1](https://firstdonoharm.dev), a source-available
> license that restricts use for "harmful" purposes. It is not OSI-approved,
> though redistribution and use in a public event-directory client are
> unaffected. It is tracked here precisely because it deviates from the
> permissive norm of everything else in this table.

## Dev/build dependencies (not shipped; used for typecheck, lint, tests, build)

| Library | Version | License | Upstream |
| --- | --- | --- | --- |
| @eslint/js | 9.39.5 | MIT | https://eslint.org |
| @tailwindcss/vite | 4.3.3 | MIT | https://tailwindcss.com |
| @testing-library/jest-dom | 7.0.1 | MIT | https://github.com/testing-library/jest-dom |
| @testing-library/react | 16.3.2 | MIT | https://github.com/testing-library/react-testing-library |
| @testing-library/user-event | 14.6.4 | MIT | https://github.com/testing-library/user-event |
| @types/leaflet | 1.9.22 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/react | 19.2.18 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @types/react-dom | 19.2.4 | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |
| @vitejs/plugin-react | 6.0.5 | MIT | https://github.com/vitejs/vite-plugin-react |
| eslint | 9.39.5 | MIT | https://eslint.org |
| eslint-plugin-react-hooks | 5.2.0 | MIT | https://react.dev/ |
| eslint-plugin-react-refresh | 0.5.4 | MIT | https://github.com/ArnaudBarre/eslint-plugin-react-refresh |
| globals | 17.11.0 | MIT | https://github.com/sindresorhus/globals |
| jsdom | 30.0.1 | MIT | https://github.com/jsdom/jsdom |
| msw | 2.15.0 | MIT | https://mswjs.io |
| openapi-typescript | 7.13.0 | MIT | https://openapi-ts.dev |
| prettier | 3.9.6 | MIT | https://prettier.io |
| tailwindcss | 4.3.3 | MIT | https://tailwindcss.com |
| typescript | 5.9.3 | Apache-2.0 | https://www.typescriptlang.org/ |
| typescript-eslint | 8.67.0 | MIT | https://typescript-eslint.io |
| vite | 8.2.1 | MIT | https://vite.dev |
| vitest | 4.1.10 | MIT | https://vitest.dev |

## Transitive dependencies

The npm dependency tree under the packages above is locked in
`package-lock.json` (hundreds of entries). Each transitive package is covered
by its own package's declared license — see `npm ls --all` for the full tree.
Only the direct dependencies are listed individually here.

## Base images

| Image | Contents license | Upstream |
| --- | --- | --- |
| `node:26-alpine` (build stage) | Node.js: MIT; Alpine: musl (MIT) + BusyBox (GPL-2.0) | https://nodejs.org / https://alpinelinux.org |
| `nginxinc/nginx-unprivileged:alpine` (runtime stage) | nginx: BSD-2-Clause; Alpine: musl (MIT) + BusyBox (GPL-2.0) | https://nginx.org / https://alpinelinux.org |

## Notes

- Version pins live in `package.json` (ranges) / `package-lock.json` (exact);
  regenerate this table when the lockfile meaningfully changes (licenses via
  the npm registry, e.g. `https://registry.npmjs.org/<name>/<version>`).