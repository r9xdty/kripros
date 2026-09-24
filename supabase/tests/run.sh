#!/usr/bin/env bash
# Creates a throwaway database, applies the migration on top of a minimal
# Supabase stand-in and runs the security tests. Uses the standard libpq
# environment variables (PGHOST, PGUSER, ...) to reach a local PostgreSQL.
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
DB="${KRIPROS_TEST_DB:-kripros_test}"

psql -X -q -v ON_ERROR_STOP=1 -d postgres -c "drop database if exists $DB" -c "create database $DB"
trap 'psql -X -q -d postgres -c "drop database if exists $DB" >/dev/null' EXIT

psql -X -q -v ON_ERROR_STOP=1 -d "$DB" \
  -f "$DIR/supabase_stub.sql" \
  -f "$DIR/../migrations/0001_init.sql" \
  -f "$DIR/rls_test.sql" 2>&1 >/dev/null | sed -e "s/^psql:[^ ]* NOTICE:  //"
