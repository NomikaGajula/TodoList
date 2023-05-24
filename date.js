exports.getDate = function () {
	var today=new Date();
	var options={
		weekday:"long",
		year:"numeric",
		month:"long",
		day:"numeric",
	};
	return day=today.toLocaleDateString("hi-IN",options);
};

exports.getDay = function () {
	var today=new Day();
	var options={
		weekday:"long",
		
	};
	return day=today.toLocaleDateString("hi-IN",options);
};


