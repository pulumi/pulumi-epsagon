PROJECT_NAME := Pulumi Epsagon Integration
SUB_PROJECTS := nodejs/epsagon
include build/common.mk

.PHONY: publish_packages
publish_packages:
	$(call STEP_MESSAGE)
	./scripts/publish_packages.sh

# The travis_* targets are entrypoints for CI.
.PHONY: travis_cron travis_push travis_pull_request travis_api
travis_cron: all
travis_push: only_build only_test publish_packages
travis_pull_request: all
travis_api: all
