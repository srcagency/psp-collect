'use strict'

const drain = require('psp-drain')

module.exports = collect

function collect() {
	const values = []
	const drainer = drain(v => values.push(v))
	const sink = read => drainer(read).then(() => values)
	sink.abort = drainer.abort
	return sink
}
