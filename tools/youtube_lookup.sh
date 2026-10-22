#!/usr/bin/env bash
# Checks the YouTube videos the stadium radio uses: oEmbed answers 200 with the
# title and channel for an embeddable public video, 401 when the owner has
# turned embedding off, 404 when it's gone. Runs in GitHub Actions.
set -u
out=research/youtube.jsonl
mkdir -p research
: > "$out"
while IFS= read -r id; do
  [ -z "$id" ] && continue
  body=$(curl -s -w '\n%{http_code}' "https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=$id")
  code=$(tail -n1 <<< "$body")
  json=$(sed '$d' <<< "$body")
  if [ "$code" = 200 ]; then
    jq -c --arg id "$id" '{id: $id, status: 200, title, author: .author_name}' <<< "$json" >> "$out"
  else
    jq -nc --arg id "$id" --arg code "$code" '{id: $id, status: ($code | tonumber)}' >> "$out"
  fi
done < tools/youtube_ids.txt
cat "$out"
