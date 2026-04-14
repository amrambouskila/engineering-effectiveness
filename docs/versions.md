# Versions

## v0.1.0 — Project Infrastructure

**Type:** Minor (initial scaffolding)

- Project infrastructure scaffolded: CLAUDE.md, README.md with Mermaid diagrams, docs/status.md, docs/versions.md
- .claude/ directory with settings.json (hooks), commands (scaffold, review, pre-commit, validate, phase-status), skills (phase-awareness, validation-protocol)
- Docker configuration: Dockerfile (multi-stage node + nginx), docker-compose.yml, nginx.conf placeholder
- Launcher scripts: run_engineering_effectiveness.sh and .bat with [k]/[q]/[v]/[r] menu
- CI/CD: .gitlab-ci.yml with lint, test, build, docker stages
- .gitignore configured for Node, Python, Docker, IDE, OS artifacts
- Master plan document referenced at project root (not moved — existing file)
- Original effectiveness.jsx preserved as reference for scoring logic and UI layout