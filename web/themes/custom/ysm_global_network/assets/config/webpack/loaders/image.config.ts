const IMAGE_LOADER_CONFIG = {
	mozjpeg: {
		quality: 75
	}, 
	pngquant: {
		quality: '10-20',
		speed: 4
	},
	svgo: {
		plugins: [{
			removeViewBox: false
		}, {
			removeEmptyAttrs: false
		}]
	},
	gifsicle: {
		optimizationLevel: 7,
		interlaced: false
	},
	optipng: {
		optimizationLevel: 7,
		interlaced: false
	}
};

export default IMAGE_LOADER_CONFIG;