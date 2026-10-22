#!/usr/bin/env bash
# Looks up candidate YouTube videos for the site's stadium radio and records
# whether each allows embedding. Runs in GitHub Actions (needs internet).
set -u
out=research/youtube.jsonl
mkdir -p research
: > "$out"
while IFS= read -r q; do
  [ -z "$q" ] && continue
  yt-dlp --skip-download --no-warnings -j "ytsearch4:$q" 2>/dev/null \
    | jq -c --arg q "$q" '{q: $q, id, title, channel, channel_follower_count, view_count, duration, playable_in_embed, availability}' >> "$out" || true
done < tools/youtube_queries.txt
wc -l "$out"
