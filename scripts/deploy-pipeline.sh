#!/usr/bin/env bash

SCRIPT_DIR=$(cd "$(dirname $0)" || exit; pwd)
eval "$(cat ${SCRIPT_DIR}/.env <(echo) <(declare -x))"

: ==================================================
:  Main
: ==================================================
echo -e "\n  deploy pipeline starting...\n"

cdk deploy --parameters githubOwnerName=${GITHUB_OWNER_NAME} --parameters githubRepoName=${GITHUB_REPO_NAME}
