#!/usr/bin/env bash
# Link the taste-mobile skill into an agent's skills directory.
#
# It links instead of copying, so `git pull` updates the installed skill.
#
#   ./install.sh               # link into Claude Code (~/.claude/skills)
#   ./install.sh --codex       # link into Codex (~/.codex/skills)
#   ./install.sh --all-agents  # both
#   ./install.sh --list        # show what would be linked
#   ./install.sh --uninstall   # remove links that point at this repo
#
# Requires bash. No other dependencies.

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAME="taste-mobile"
SRC="$REPO/skills/$NAME"

targets=()
mode=install

while [[ $# -gt 0 ]]; do
  case "$1" in
    --claude)      targets+=("$HOME/.claude/skills") ;;
    --codex)       targets+=("$HOME/.codex/skills") ;;
    --all-agents)  targets+=("$HOME/.claude/skills" "$HOME/.codex/skills") ;;
    --list)        mode=list ;;
    --uninstall)   mode=uninstall ;;
    -h|--help)     awk 'NR>1 { if ($0 !~ /^#/) exit; sub(/^# ?/, ""); print }' "${BASH_SOURCE[0]}"; exit 0 ;;
    *)             echo "unknown argument: $1" >&2; exit 2 ;;
  esac
  shift
done

[[ ${#targets[@]} -eq 0 ]] && targets=("$HOME/.claude/skills")
[[ -f "$SRC/SKILL.md" ]] || { echo "error: $SRC/SKILL.md not found" >&2; exit 1; }

problems=0
for target in "${targets[@]}"; do
  link="$target/$NAME"
  case "$mode" in
    list)
      echo "$NAME  ->  $link" ;;
    uninstall)
      if [[ -L $link && "$(readlink "$link")" == "$SRC" ]]; then
        rm "$link"; echo "removed  $link"
      elif [[ -e $link ]]; then
        echo "left     $link (not a link to this repo)" >&2
      fi ;;
    install)
      mkdir -p "$target"
      if [[ -L $link ]]; then
        if [[ "$(readlink "$link")" == "$SRC" ]]; then
          echo "ok       $link (already linked)"; continue
        fi
        echo "skip     $link (a link to another install: remove it first)" >&2
        problems=$((problems + 1)); continue
      elif [[ -e $link ]]; then
        echo "skip     $link (a real folder, maybe an older copy: move it aside first)" >&2
        problems=$((problems + 1)); continue
      fi
      ln -s "$SRC" "$link"
      echo "linked   $link -> skills/$NAME" ;;
  esac
done

[[ $problems -eq 0 ]] || exit 1
