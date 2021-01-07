# CHANGELOG

All notable changes to this project will be documented in this file.

> **Tags**
>
> - Features
> - Bug Fixes
> - Performance Improvements
> - Enhancements
> - Dependency Updates
> - Breaking Changes
> - Documentation
> - Internal
> - Unreleased

## v3.0.0 (2021-01-07)

#### Features

- hooks ([9af54d1](https://github.com/sibiraj-s/capillaries/commit/9af54d1))
- `event.on` returns `unsubscribe` method ([9af54d1](https://github.com/sibiraj-s/capillaries/commit/9af54d1))

#### Breaking Changes

- removed `event.off` method ([9af54d1](https://github.com/sibiraj-s/capillaries/commit/9af54d1))

**Before**

```js
const event = new Events()

const handler = () => {}

event.on('a', handler)

// To Unsubscribe
event.off('a', handler)
// or
event.off('a')
```

**After**

```js
const event = new Events()

const handler = () => {}

const unsubscribe = event.on('a', handler)

// To Unsubscribe
unsubscribe()
// or
event.unbindAll('a')
```


## v2.1.2 (2021-01-05)

#### Bug Fixes

- freeze event instance ([2102012](https://github.com/sibiraj-s/capillaries/commit/2102012))

## v2.1.1 (2021-01-05)

#### Bug Fixes

- prefer arrow functions ([043cc86](https://github.com/sibiraj-s/capillaries/commit/043cc86))

## v2.1.0 (2021-01-05)

#### Features

- disable sideEffects for webpack compilation ([8b2f0f8](https://github.com/sibiraj-s/capillaries/commit/8b2f0f8))
- perfer modules instead of browser ([1db3597](https://github.com/sibiraj-s/capillaries/commit/1db3597))
- support `*` wildcard event listener ([baf787f](https://github.com/sibiraj-s/capillaries/commit/baf787f))
- remove private properties ([15bc041](https://github.com/sibiraj-s/capillaries/commit/15bc041))

## v2.0.6 (2020-12-13)

#### Internal

- update LICENSE ([26f258a](https://github.com/sibiraj-s/capillaries/commit/26f258a))

## v2.0.5 (2020-12-13)

#### Internal

- update LICENSE ([bcf4a48](https://github.com/sibiraj-s/capillaries/commit/bcf4a48))

## v2.0.4 (2019-11-17)

#### Internal

- migrate from travis-ci to Github actions ([edb028f](https://github.com/sibiraj-s/capillaries/commit/edb028f))
- bump devDependencies ([c387a5d](https://github.com/sibiraj-s/capillaries/commit/c387a5d))

## v2.0.3 (2019-11-12)

#### Internal

- update rollup to v1.27.0 ([6d14f87](https://github.com/sibiraj-s/capillaries/commit/6d14f87))
- update main field in package.json ([9bd7f6a](https://github.com/sibiraj-s/capillaries/commit/9bd7f6a))

## v2.0.2 (2019-11-12)

#### Enhancements

- return immutable object while invoking the constructor function ([b691adf](https://github.com/sibiraj-s/capillaries/commit/b691adf))

## v2.0.1 (2019-11-11)

#### Documentation

- remove/update outdated api's from README.md ([8db7c34](https://github.com/sibiraj-s/capillaries/commit/8db7c34))

## v2.0.0 (2019-11-11)

#### Breaking Changes

- remove `detachEvents` method ([c701e6d](https://github.com/sibiraj-s/capillaries/commit/c701e6d))
- rename `detachAll` method to `unbindAll` ([c701e6d](https://github.com/sibiraj-s/capillaries/commit/c701e6d))

#### Internal

- update rollup to v1.26.5 ([19e6cc8](https://github.com/sibiraj-s/capillaries/commit/19e6cc8))
- update terser to v4.4.0 ([19e6cc8](https://github.com/sibiraj-s/capillaries/commit/19e6cc8))

## v1.1.1 (2019-11-10)

#### Bug Fixes

- update typings ([44ddfe2](https://github.com/sibiraj-s/capillaries/commit/44ddfe2))

## v1.1.0 (2019-11-10)

#### Features

- add typings support ([a5bd980](https://github.com/sibiraj-s/capillaries/commit/a5bd980))

## v1.0.0 (2019-11-10)

#### Features

- **Initial Release**: Javascript events
