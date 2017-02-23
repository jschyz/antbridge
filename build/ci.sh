set -e
npm run lint
npm run test:unit
npm run test:cover

# report coverage stats for non-PRs
if [[ -z $CI_PULL_REQUEST ]]; then
  cat ./coverage/lcov.info | ./node_modules/.bin/codecov
fi
