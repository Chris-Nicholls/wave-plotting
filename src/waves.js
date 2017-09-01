var waves = function(data) {
	
	var half = data.map((x) => {return [x[0], Math.sign(x[1])]})

	return half;
}

