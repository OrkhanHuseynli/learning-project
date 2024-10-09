SHELL=/bin/bash
DEFAULT_GOAL := help

PROJECT = pox-nx-pg
APP_DIR = ./

####################################################################################################
# Coloring
####################################################################################################

RESET_COLOR   = \033[m

BLUE       = \033[1;34m
YELLOW     = \033[1;33m
GREEN      = \033[1;32m
RED        = \033[1;31m
BLACK      = \033[1;30m
MAGENTA    = \033[1;35m
CYAN       = \033[1;36m
WHITE      = \033[1;37m

DBLUE      = \033[0;34m
DYELLOW    = \033[0;33m
DGREEN     = \033[0;32m
DRED       = \033[0;31m
DBLACK     = \033[0;30m
DMAGENTA   = \033[0;35m
DCYAN      = \033[0;36m
DWHITE     = \033[0;37m

BG_WHITE   = \033[47m
BG_RED     = \033[41m
BG_GREEN   = \033[42m
BG_YELLOW  = \033[43m
BG_BLUE    = \033[44m
BG_MAGENTA = \033[45m
BG_CYAN    = \033[46m

define colorecho
	@printf "%b" "$2"
	@echo -n ">>> $1"
	@printf "%b" "$(RESET_COLOR)\n"
endef


####################################################################################################
# Auxiliary targets
####################################################################################################

.PHONY: help
help:
	@ grep -E '^[a-zA-Z_-]+:.*?## .*$$' ./Makefile \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: cleanup
cleanup: ## Remove cache & dependencies
	$(call colorecho,"[$*] Deleting redis chache and nodejs build ...",$(DCYAN))
	-docker-compose rm -v -s -f
	-rm -rf ./redis/cache
	-rm -rf ./reporting-api/dist



.PHONY: cleanup-all
cleanup-all: ## Remove node_modules, cache & dependencies
	$(call colorecho,"[$*] Deleting node_modules and  redis chache and nodejs build ...",$(DCYAN))
	-docker-compose rm -v -s -f
	-rm -rf ./redis/cache
	-rm -rf ./reporting-api/dist
	-rm -rf ./reporting-api/node_modules	




####################################################################################################
# Main targets
####################################################################################################


.PHONY: run-app
run-app: ## Run app locally (Note: this command doesnt run redis)
	$(call colorecho,"[$*] Running ${PROJECT} ...",$(DCYAN))
	cd ${APP_DIR} && npm run dev

.PHONY: test
test: ## Run unit tests locally (Note: this command doesnt run redis)
	$(call colorecho,"[$*] Running ${PROJECT} ...",$(DCYAN))
	cd ${APP_DIR} && npm run test

# .PHONY: run-app-debug
# run-app-debug: ## Run app locally on a debug mode (Note: this command doesnt run redis)
# 	$(call colorecho,"[$*] Running ${PROJECT} ...",$(DCYAN))
# 	cd ${APP_DIR} && yarn start:debug


.PHONY: run
run: ## Start redis and run app locally
	- docker-compose up -d postgres && cd ${APP_DIR} && npm run dev

# .PHONY: run-debug
# run-debug: ## Start redis and run app on a debug mode locally
# 	- docker-compose up -d cache && cd ${APP_DIR} && yarn start:debug

# .PHONY: run-cache
# run-cache: ## Start redis cache
# 	- docker-compose up -d cache

.PHONY: sart-all
start-all: ## Start all containers
	- docker-compose up

.PHONY: stop-all
stop-all: ## Stop all containers
	- docker-compose rm -v -s -f


DEFAULT=fuga
test-arg:
	@echo $(DEFAULT)


.PHONY: prisma-toto
prisma-toto:
ifdef toto
	@echo ${toto}
else
	@echo 'no toto around'
endif