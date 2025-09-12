# Changelog

## [2.6.0](https://github.com/HardCarryClub/bald-man-bot/compare/v2.5.0...v2.6.0) (2025-09-12)


### Features

* add audit logging ([c1d78e5](https://github.com/HardCarryClub/bald-man-bot/commit/c1d78e5998c8d849b614aa2d1c6ce5675e39f0a8))
* add host scheduling and signup ([#65](https://github.com/HardCarryClub/bald-man-bot/issues/65)) ([b40f713](https://github.com/HardCarryClub/bald-man-bot/commit/b40f713e9ba0b7f1fc6ea97d220620576668eae3))
* move interactions to gateway and disable resharding ([#60](https://github.com/HardCarryClub/bald-man-bot/issues/60)) ([be85c68](https://github.com/HardCarryClub/bald-man-bot/commit/be85c686ba5b8d6f3f9bacfeff2fa6d1f5abb5ee))


### Bug Fixes

* **deps:** update dependency discord-api-types to v0.38.24 ([#53](https://github.com/HardCarryClub/bald-man-bot/issues/53)) ([0cbfbbc](https://github.com/HardCarryClub/bald-man-bot/commit/0cbfbbc7ebb1118cd237e601e01fcac48c636bec))
* **deps:** update dependency dressed to v1.10.0-canary.5.7.3 ([#54](https://github.com/HardCarryClub/bald-man-bot/issues/54)) ([c8bbc0c](https://github.com/HardCarryClub/bald-man-bot/commit/c8bbc0c2cc150bb0a448f6311e58ab6505317583))
* **deps:** update dependency pino to v9.9.5 ([#63](https://github.com/HardCarryClub/bald-man-bot/issues/63)) ([7f61456](https://github.com/HardCarryClub/bald-man-bot/commit/7f61456de2f16c2cb961b441532d3207d9248b3d))

## [2.5.0](https://github.com/HardCarryClub/bald-man-bot/compare/v2.4.0...v2.5.0) (2025-09-09)


### Features

* add base ws and also persisting PUG ban on rejoin (closes [#25](https://github.com/HardCarryClub/bald-man-bot/issues/25)) ([3734d01](https://github.com/HardCarryClub/bald-man-bot/commit/3734d0158cadc229839bde94df82e192b91028e5))
* add config.yaml.example template and update .gitignore ([ff0dc71](https://github.com/HardCarryClub/bald-man-bot/commit/ff0dc71813fc3246cb771bb5c9cb6fc83a70d5fb))
* add game column to user notes and discord messages tables, refactor table names ([3a520e4](https://github.com/HardCarryClub/bald-man-bot/commit/3a520e4add25a2c5eab516fc34f73beac4fbe282))
* add game to pug lobby ([b732ec7](https://github.com/HardCarryClub/bald-man-bot/commit/b732ec7bc4da258c020f5014faad360c01469f0c))
* add guilds configuration to command settings (closes [#41](https://github.com/HardCarryClub/bald-man-bot/issues/41)) ([e64c974](https://github.com/HardCarryClub/bald-man-bot/commit/e64c974ea5aa6e947befeb02db64f131f06f4194))
* disable mentions ([0899b81](https://github.com/HardCarryClub/bald-man-bot/commit/0899b81b5c3ea56eab9e90b8471c2243e0e1ffb0))
* extract command option to const ([62837c1](https://github.com/HardCarryClub/bald-man-bot/commit/62837c1c35321c2d517235439833e33b22f84fcb))
* support multi-game PUG Lobbies ([e93c796](https://github.com/HardCarryClub/bald-man-bot/commit/e93c796bd9c0d1ca7cf832157f0532d87604ae85))
* switch to yaml config ([8e0c34e](https://github.com/HardCarryClub/bald-man-bot/commit/8e0c34ed5d1fe4e8de1bcc820113434e897c93fc))


### Bug Fixes

* add the column after the user_id ([9f51b7f](https://github.com/HardCarryClub/bald-man-bot/commit/9f51b7f28315bfc71f834d4622da1ab1a06aec2a))
* correct query for existing PUG lobby in removeLobby function ([40762be](https://github.com/HardCarryClub/bald-man-bot/commit/40762bea9ca599236fe9fa3e7eebd431bd5d88e3))
* **deps:** update dependency dressed to v1.9.0 ([#37](https://github.com/HardCarryClub/bald-man-bot/issues/37)) ([9316401](https://github.com/HardCarryClub/bald-man-bot/commit/931640180c6c2d52ecb39704088c4eb696b941b5))
* **deps:** update dependency dressed to v1.9.1 ([#51](https://github.com/HardCarryClub/bald-man-bot/issues/51)) ([199e9e1](https://github.com/HardCarryClub/bald-man-bot/commit/199e9e146a81f4822ad5d6f1b68d8a30dda5b481))
* handle errors when refreshing user notes ([d2cf29f](https://github.com/HardCarryClub/bald-man-bot/commit/d2cf29f0276b1c08fc184a7b03889a080605a5dd))
* move guild ID to env ([d1ebd95](https://github.com/HardCarryClub/bald-man-bot/commit/d1ebd95180d8e2a5f58c0a4b7f1f27890d420071))
* reference env through util ([c1fc1ae](https://github.com/HardCarryClub/bald-man-bot/commit/c1fc1ae91cd29407cf9ccb491fd42e455f1d822c))
* remove unused dependencies from package.json ([7e59bc4](https://github.com/HardCarryClub/bald-man-bot/commit/7e59bc43fad6616124f933f08789767680a2d9ba))
* support multi-game in discord message query ([d7b0f22](https://github.com/HardCarryClub/bald-man-bot/commit/d7b0f22216687faaa49dff3f47c343b22b05a826))
* support windows devs ([072978c](https://github.com/HardCarryClub/bald-man-bot/commit/072978c9e41d049f054e25e82dc683749bc650e0))
* typing mismatch ([aa0c2d1](https://github.com/HardCarryClub/bald-man-bot/commit/aa0c2d1580001314c49589fd37b44b44835e2994))
* update imports to use config instead of env ([e2b4e9a](https://github.com/HardCarryClub/bald-man-bot/commit/e2b4e9a150c93c9cf43f2376d7967ba134de4c4f))
* use integer instead of number for pug note remove ([ee23ec2](https://github.com/HardCarryClub/bald-man-bot/commit/ee23ec27ccc164b88af4f5505261a41b7a3bb397))

## [2.4.0](https://github.com/HardCarryClub/bald-man-bot/compare/v2.3.0...v2.4.0) (2025-07-26)


### Features

* **time:** add thisOrNext function for scheduling ([3b1d793](https://github.com/HardCarryClub/bald-man-bot/commit/3b1d79312d52136193c751ae1637ab7f18e4d0bd))

## [2.3.0](https://github.com/HardCarryClub/bald-man-bot/compare/v2.2.0...v2.3.0) (2025-07-26)


### Features

* **procinfo:** add process info command ([fa3e102](https://github.com/HardCarryClub/bald-man-bot/commit/fa3e1023efd92a12de9ac74bfad09d50a35d5751))

## [2.2.0](https://github.com/HardCarryClub/bald-man-bot/compare/v2.1.1...v2.2.0) (2025-07-26)


### Features

* **pug-msg:** add roles message with image display ([bfc90e5](https://github.com/HardCarryClub/bald-man-bot/commit/bfc90e51f03f36f2b83d0f74bbf3c556a814a970))

## [2.1.1](https://github.com/HardCarryClub/bald-man-bot/compare/v2.1.0...v2.1.1) (2025-07-26)


### Bug Fixes

* correct header flag in Coolify deployment step ([d6de256](https://github.com/HardCarryClub/bald-man-bot/commit/d6de256f80d181e1035cd5839d18e68e364fc25b))

## [2.1.0](https://github.com/HardCarryClub/bald-man-bot/compare/v2.0.0...v2.1.0) (2025-07-26)


### Features

* add deployment step to Coolify in release workflow ([433e2f1](https://github.com/HardCarryClub/bald-man-bot/commit/433e2f194ebad72586d7a2b2dc93a6db637095dd))
* update the join message ([725274f](https://github.com/HardCarryClub/bald-man-bot/commit/725274f27fb0f151b7b14231ef1a17b173b6cb73))

## [2.0.0](https://github.com/HardCarryClub/bald-man-bot/compare/v1.0.0...v2.0.0) (2025-07-26)

### ⚠ BREAKING CHANGES

* **rewrite:** full rewrite to the bun and v2 ([#28](https://github.com/HardCarryClub/bald-man-bot/issues/28))

### Bug Fixes

* forcing v2 release ([258c346](https://github.com/HardCarryClub/bald-man-bot/commit/258c346db1335ce87f6262f5b779bb45030078f0))

## 1.0.0

### Features

* add pug message command to have canned messages ([c5ee737](https://github.com/HardCarryClub/bald-man-bot/commit/c5ee7372f9403c29cad5ba5bfe5d86d726d3733f))
* add release workflow configuration ([77916ab](https://github.com/HardCarryClub/bald-man-bot/commit/77916abbd1293a71bc5a798941e2d37ee84b0c4e))
* add release-please configuration file ([198c155](https://github.com/HardCarryClub/bald-man-bot/commit/198c155647e5275e59195a875622dfbef510a149))
* add release-please manifest for version 2.0.0 ([c796685](https://github.com/HardCarryClub/bald-man-bot/commit/c796685995b2efaa7f5531fab9eff06bce125009))
* add release-please-manifest.json for versioning ([5b1102f](https://github.com/HardCarryClub/bald-man-bot/commit/5b1102fb6672740b5a3e55f1b2b8f26142db1329))
* add renovate ([8437eba](https://github.com/HardCarryClub/bald-man-bot/commit/8437eba1c004e80a29842a07ce8982894a1e6a5b))
* add schedule subcommand to pug message command ([#9](https://github.com/HardCarryClub/bald-man-bot/issues/9)) ([7f9ab10](https://github.com/HardCarryClub/bald-man-bot/commit/7f9ab1038383f50b5a68f2b23b65e1d38d642793))
* add support for best lobby b ([c26833e](https://github.com/HardCarryClub/bald-man-bot/commit/c26833edceda615c9aa300d334f3e6e77f5faef2))
* baldman source ([85875ec](https://github.com/HardCarryClub/bald-man-bot/commit/85875ec520be9c3061a8b6a66dfbfa0a76cc2b7d))
* initial source plus some extra ([763c837](https://github.com/HardCarryClub/bald-man-bot/commit/763c837249c48e0da7269f74724ebe744836f289))
* **rewrite:** full rewrite to the bun and v2 ([#28](https://github.com/HardCarryClub/bald-man-bot/issues/28)) ([b1e4968](https://github.com/HardCarryClub/bald-man-bot/commit/b1e4968f69674bcc64c8eac59dac6da8e3d4e148))


### Bug Fixes

* add bot:generate command to Dockerfile CMD ([872311d](https://github.com/HardCarryClub/bald-man-bot/commit/872311d5a5754dff41f660064c1ca7a310be7f60))
* add missing run script ([27ed1bf](https://github.com/HardCarryClub/bald-man-bot/commit/27ed1bf2f4802af6f0938b3a275ecc9cd2cf33bf))
* add volume declaration for data persistence ([1b2d5ff](https://github.com/HardCarryClub/bald-man-bot/commit/1b2d5ff722ba6f0d80c98c651f3b8c0e5f3928b8))
* adjusted schedule subcommand to adhere to schedule changes ([#24](https://github.com/HardCarryClub/bald-man-bot/issues/24)) ([2a5b999](https://github.com/HardCarryClub/bald-man-bot/commit/2a5b9992a8b3e047bd62302a0bd8a83289a9c593))
* correct command syntax in Dockerfile for bot:generate ([c6a68c4](https://github.com/HardCarryClub/bald-man-bot/commit/c6a68c4e0896658c7916edd616e9e1bb54ee1217))
* **deps:** update dependency @hono/node-server to v1.14.0 ([#8](https://github.com/HardCarryClub/bald-man-bot/issues/8)) ([466fbda](https://github.com/HardCarryClub/bald-man-bot/commit/466fbdaadcb1d27602a726ca79f84c0b49534221))
* **deps:** update dependency @hono/node-server to v1.14.1 ([#16](https://github.com/HardCarryClub/bald-man-bot/issues/16)) ([6d094a6](https://github.com/HardCarryClub/bald-man-bot/commit/6d094a68f5f9d39c3943ebe75f421a2edb3f16e4))
* **deps:** update dependency discord-api-types to v0.37.120 ([#15](https://github.com/HardCarryClub/bald-man-bot/issues/15)) ([78e3525](https://github.com/HardCarryClub/bald-man-bot/commit/78e352591c5d3d40f3f99276b547677a609d7220))
* **deps:** update dependency dressed to v1.9.0-rc.2 ([#30](https://github.com/HardCarryClub/bald-man-bot/issues/30)) ([2c60ba4](https://github.com/HardCarryClub/bald-man-bot/commit/2c60ba43778c30b35288029868ed34662ecf6bee))
* **deps:** update dependency hono to v4.7.2 ([#4](https://github.com/HardCarryClub/bald-man-bot/issues/4)) ([84a143f](https://github.com/HardCarryClub/bald-man-bot/commit/84a143fc537031415aae9245e07f156fdd316316))
* **deps:** update dependency hono to v4.7.5 ([#7](https://github.com/HardCarryClub/bald-man-bot/issues/7)) ([25ccc5b](https://github.com/HardCarryClub/bald-man-bot/commit/25ccc5bf6d1a96e67bc349c3c0b7fda69dca729b))
* **deps:** update dependency hono to v4.7.6 ([#14](https://github.com/HardCarryClub/bald-man-bot/issues/14)) ([e95f93c](https://github.com/HardCarryClub/bald-man-bot/commit/e95f93c43ff831765b52a2fbf6b3562ce1aed47c))
* enforced correct pugging times in schedule & added NA times ([#11](https://github.com/HardCarryClub/bald-man-bot/issues/11)) ([6b009a2](https://github.com/HardCarryClub/bald-man-bot/commit/6b009a20c994cade12a45f3ab5e0f056ed62537b))
* remove subdomain ([7f16abc](https://github.com/HardCarryClub/bald-man-bot/commit/7f16abc0068eaa1c714121cee9bf3f6a9c035ce4))
* remove unnecessary config-file and manifest-file from release-please action ([3428e67](https://github.com/HardCarryClub/bald-man-bot/commit/3428e672be3adf80448c907fd27111ef95258884))
* revert dressed dependency to version 1.9.0-rc.2 ([fb8f4c4](https://github.com/HardCarryClub/bald-man-bot/commit/fb8f4c41a96f0a24a7a575e226590c796ad22ce0))
* revert version to 1.0.0 ([d377ebd](https://github.com/HardCarryClub/bald-man-bot/commit/d377ebdf6886851208fe241b5097d6448889da9f))
* simplify CMD in Dockerfile for migration and bot generation ([a78f3be](https://github.com/HardCarryClub/bald-man-bot/commit/a78f3be4c12c6bf235ba7d82892de46f6f61072a))
* update .dockerignore and Dockerfile for data directory handling ([ea08d2e](https://github.com/HardCarryClub/bald-man-bot/commit/ea08d2e6ff9817a952919dc911ad73a93aac1d12))
* update CMD in Dockerfile to specify working directory for migrate and start ([0d164ea](https://github.com/HardCarryClub/bald-man-bot/commit/0d164ead27c7cf73d900401ab7275ec8e85b9916))
* update dev script to run start command ([0afea82](https://github.com/HardCarryClub/bald-man-bot/commit/0afea8233052aec210b0d1ab858e3f1be538df6d))
* update Dockerfile and package.json scripts for migration and development ([320bbc6](https://github.com/HardCarryClub/bald-man-bot/commit/320bbc63a5dfd90d28d36cc54abe6810662889ff))
* update manifest-file in release-please workflow ([1ef9a91](https://github.com/HardCarryClub/bald-man-bot/commit/1ef9a91e45b489c0382659a5a5d36ada770847f9))
* update release-please action configuration ([18be9da](https://github.com/HardCarryClub/bald-man-bot/commit/18be9dad767f12568e3ee34b84992e2421be74a9))
