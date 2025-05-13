.PHONY: build
build:
	npm run build

.PHONY: deploy
deploy:
	ansible-playbook -i deploy/inventory.yaml deploy/playbook.yaml