'use strict'

const test = require('tape')
const {pull, values, error} = require('pull-stream')
const collect = require('./')

test(t => {
	t.plan(2)
	const stream = pull(values([1, 2, 3]), collect())

	t.ok(stream instanceof Promise, '`stream` is a promise')
	stream.then(values => t.deepEqual(values, [1, 2, 3], 'resolved value'))
})

test('collect a stream which is aborted', t => {
	t.plan(1)
	let count = 0
	const sink = collect()
	const stream = pull((end, cb) => {
		if (end) return cb(end)
		count++
		if (count >= 3) sink.abort()
		cb(null, count)
	}, sink)

	stream.then(r => {
		t.deepEqual(r, [1, 2], 'resolved value')
	})
})

test('collect a stream which is aborted with an error', t => {
	t.plan(1)
	const testError = new Error('test')
	let count = 0
	const sink = collect()
	const stream = pull((end, cb) => {
		if (end) return cb(end)
		count++
		if (count >= 3) sink.abort(testError)
		cb(null, count)
	}, sink)

	stream.catch(err => {
		t.deepEqual(err, testError, 'rejection value')
	})
})

test('collect an empty stream', t => {
	t.plan(1)
	const stream = pull(values([]), collect())

	stream.then(values => t.deepEqual(values, [], 'resolved value'))
})

test('collect a stream with an error in the beginning', t => {
	t.plan(1)
	const testError = new Error('test')
	const stream = pull(error(testError), collect())

	stream.catch(e => t.equal(e, testError, 'rejection value'))
})

test('collect a stream which errors', t => {
	t.plan(1)
	const testError = new Error('test')
	let count = 0
	const stream = pull(function(end, cb) {
		if (end) return cb(end)
		if (count++ < 2) return cb(null, count)
		cb(testError)
	}, collect())

	stream.catch(e => t.equal(e, testError, 'rejection value'))
})
