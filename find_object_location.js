function find_object_location(object, global, skip, comparator, /*limit,*/ include_buildin_property) {
	const id_prop = String.fromCharCode(Math.random() * 1e10) + String.fromCharCode(Math.random() * 1e10);

	// limit = limit ? limit : -1;
	global = global ? global : window;
	undefined === skip && (skip = []);
	undefined === comparator && (comparator = ((a, b) => a === b));
	undefined === include_buildin_property && (include_buildin_property = false);

	let objs = [];
	// let obj = [
	//     'parent',
	//     'property',
	//     'obj',
	// ];

	let _result = [];

	function _indexOf(obj) {
		for (let i = 0, end = objs.length; i < end; ++i) {
			if (obj === objs[i][2])
				return i;
		}
		return -1;
	}

	let callee = arguments.callee;
	skip.push(callee);

	function _extract_all_properties(loc) {
		let obj = objs[loc][2];
		if (!(obj instanceof Object))
			return false;
		let props = include_buildin_property ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
		for (let i = 0, end = props.length; i < end; ++i) {
			let child = null;
			let prop = props[i];
			try {
				child = obj[prop];
			} catch (e) {
				continue;
			}
			if (skip.includes(child))
				continue;
			if (child instanceof Object && !child.hasOwnProperty(id_prop)) {
				objs.push([loc, prop, child, ]);
				child[id_prop] = true;
				if (0 === objs.length % 1e4)
					console.log('Iteration... total: ' + objs.length + ' objects!');
			}
			if (comparator(object, child)) {
				_result.push([loc, prop, child, ]);
			}
		}
		return true;
	}

	function _bfs() {
		objs.push([-1, null, global, ]);
		global[id_prop] = true;
		let loc = 0;
		while (loc < objs.length /*&& (-1 === limit || loc < limit)*/ ) {
			_extract_all_properties(loc);
			++loc;
		}
		return;
	}

	function _get_object_info(obj) {
		let path = [];
		path.push(obj[1]);
		loc = obj[0];
		while (-1 !== loc) {
			path.push(objs[loc][1]);
			loc = objs[loc][0];
		}
		path.pop();
		return {
			path: path.reverse(),
			obj: obj[2],
		}
	}

	_bfs();
	objs.forEach(function(e, i) {
		delete e[2][id_prop];
	});
	console.log('Iteration through ' + objs.length + ' objects!');
	return _result.map(function(res) {
		return _get_object_info(res);
	});
}


function store(object) {
	return function() {
		return object;
	};
}


// window.get_object = store(object);

// find_object_location(get_object(), window, [], undefined, false);

// find_object_location(get_object(), window, [], undefined, false).map((e) => e.path.join('.')).join('\n');

find_object_location("Xo5ODRl8", window, [], undefined, false).map((e) => e.path.join('.')).join('\n');

// find_object_location("Xo5ODRl8", window, [], (a, b) => (b && (b.AES) && (b.AES.decrypt)), false).map((e) => e.path.join('.')).join('\n');

