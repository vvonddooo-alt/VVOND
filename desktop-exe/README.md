# WOND Windows EXE

The web app is the source of truth. This Tauri 2 project wraps it as a Windows desktop application.

## Build on Windows
1. Install Rust and the Tauri 2 prerequisites.
2. Open this folder in a terminal.
3. Run `cargo tauri build`.
4. The Windows installer/EXE will be under `target/release/bundle/`.

The current build environment does not contain Rust/Tauri, so the EXE cannot be compiled here yet; the project is prepared for it.
