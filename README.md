# JB trading values

easy way to access multiple value lists should update every 2h

i will probably add jbvalues support soon ( i know they have an api )

## Data types

shortened
[types.ts](https://github.com/Lolikarbuzik/jbtradingvalues/blob/master/src/types.ts)

### Dupes

[cached](https://github.com/Lolikarbuzik/jbtradingvalues/blob/master/cached/dupers.json)

```ts
interface Duper {
	name: String
	item: String | undefined // This is exists for JBValues dupes
}
```

### Items

[cached jbtrading](https://github.com/Lolikarbuzik/jbtradingvalues/blob/master/cached/jbtrading.json)

[cached jbtc](https://github.com/Lolikarbuzik/jbtradingvalues/blob/master/cached/jbtc.json)

```ts
interface Item {
	name: string
	value: number
	demand: None | VeryLow | Low | Mid | Decent | High
	duped_value: number | undefined
	notes: string | undefined // This is for JBTC notes
	og: string | undefined // Ignore this
}
```
