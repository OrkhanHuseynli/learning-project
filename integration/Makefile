SHELL=/bin/bash
DEFAULT_GOAL := help

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


####################################################################################################
# Validation targets
####################################################################################################

.PHONY: compose-up-db
compose-up-db: ## Start DB container and wait for it to be ready
	@ docker-compose up -d db
	@ ./wait-mysql.sh db


.PHONY: compose-stop-all
compose-stop-all: ## Stop all containers
	@ $(call colorecho,"Cleaning local DEV env ...",$(DCYAN))
	- docker-compose rm -v -s -f



.PHONY: compose-up-migrations
compose-up-migrations: ## Start migrations container (execute locally with local DB)
	@ $(call colorecho,"Applying migrations on local DEV DB ...",$(DCYAN))
	@ docker-compose up --build migrations


 .PHONY: compose-up
 compose-up: compose-up-db compose-up-migrations  ## tart DB container and wait for it to be ready and then start migrations container