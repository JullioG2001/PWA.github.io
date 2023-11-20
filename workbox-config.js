module.exports = {
	globDirectory: 'Javascript/',
	globPatterns: [
		'**/*.js'
	],
	swDest: 'Javascript/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};