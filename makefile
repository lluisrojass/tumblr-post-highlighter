export SHELL := /bin/bash
export PATH := $(PWD)/node_modules/.bin:$(PATH)

PACKAGE := content background
BUILD_PACKAGES := $(addprefix build., $(PACKAGE))
WATCH_PACKAGES := $(addprefix watch., $(PACKAGE))

build: clean.dist test | $(BUILD_PACKAGES)
	@rm -r ./__dist__/.tmp/

$(BUILD_PACKAGES): build.%: __dist__/manifest.json __dist__/icons
	@rollup --environment NODE_ENV:production,BUILD:production \
	--config ./tools/configs/$*.config.js

__dist__/%: __dist__
	@cp -R $(PWD)/$* $(PWD)/__dist__/$*

__dist__:
	@mkdir __dist__

$(WATCH_PACKAGES): watch.%: __watch__/manifest.json __watch__/icons
	@rollup --environment NODE_ENV:development,BUILD:development \
	--config ./tools/configs/$*.config.js --watch

# symlink  
__watch__/%: __watch__
	@ln -shF $(PWD)/$* $(PWD)/__watch__

__watch__:
	@mkdir __watch__

test:
	@jest

typecheck:
	@tsc

i: 
	@npm i

clean: clean.dist clean.watch clean.test

clean.dist:
	@rm -rf ./__dist__

clean.watch:
	@rm -rf ./__watch__

clean.test:
	@rm -rf ./reports

.PHONY: clean clean.dist clean.watch clean.test i typecheck \
	build test $(BUILD_PACKAGES) $(WATCH_PACKAGES)