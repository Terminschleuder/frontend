# terminschleuder demo client — functional documentation

This folder is the functional documentation for the terminschleuder demo client: what the
app is for, how it's built, how it talks to the API, what the data shapes look like, and a
per-page use-case guide for first-time visitors.

All pages are GitHub-renderable Markdown (diagrams use
[Mermaid](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-markdown/creating-diagrams),
which GitHub renders inline).

## Contents

| Document | Scope |
| -------- | ----- |
| [Architecture](architecture.md) | High-level design, the read-only unauthenticated SPA constraint, container/CI layout, request lifecycle, tech stack, config, project layout. |
| [API reference](api-reference.md) | Every read-only endpoint the SPA consumes: conventions, params, and `client.get(...)` examples. |
| [Data model](data-model.md) | The client-side TypeScript types (`City`, `Event`, `Venue`, `Organization`, `Category`, pagination) as an ER diagram + field tables. |
| [Features](features.md) | UI use-case guide: each page and the API capability it demonstrates, for first-time visitors. |

> For the quickstart (running it locally), see the [top-level README](../README.md).
> For the rules AI agents must follow when editing this repo, see
> [`AGENTS.md`](../AGENTS.md).