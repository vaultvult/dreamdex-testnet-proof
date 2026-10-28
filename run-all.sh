#!/bin/bash
mkdir -p evidence

echo "Executing Reproductions..."

echo "Running Bug 1..."
npx tsx repros/repro_1_silent_drop.ts > evidence/bug1_output.txt

echo "Running Bug 2..."
npx tsx repros/repro_2_typeerror_crash.ts > evidence/bug2_output.txt

echo "Running Bug 3..."
npx tsx repros/repro_3_null_query.ts > evidence/bug3_output.txt

echo "✅ All reproductions finished. Check the /evidence folder for transcripts."
