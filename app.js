var express = require('express');
var app = express();
var fs = require('fs');
var haversine = require('haversine');
var _ = require('underscore');
var os = require('os');

const Bristol_coord = {
	latitude: 51.450167,
	longitude: -2.594678
};

const filter = function() {
	console.log('Writing output1.json...');

	var people;

	fs.readFile('people.json', 'utf8', function (err, data) {
	  if (err) throw err;

	  people = JSON.parse(data);

	  // run distance filter
	  var output1 = _.filter(people, function(item) {
	  	const coord = {
	  		latitude: parseFloat(item.location.latitude),
	  		longitude: parseFloat(item.location.longitude),
	  	};
	  	return (haversine(Bristol_coord, coord, { unit: 'km' }) <= 100) && (item.country === 'england');
	  });

	  // sort by distance
	  output1 = _.sortBy(output1, function(item) {
	  	const coord = {
	  		latitude: parseFloat(item.location.latitude),
	  		longitude: parseFloat(item.location.longitude),
	  	};
	  	return -haversine(Bristol_coord, coord);
	  });

	  // pick id, name, value, email from filtered collection
	  output1 = output1.map(item => {
	  	return _.pick(item, 'id', 'name', 'value', 'email');
	  });

	  // print filter result to console
	  console.log('output1: ', output1);

	  // write filter result output1.json file
	  fs.writeFile('output1.json', JSON.stringify(output1), 'utf8', function(err) {
	  	if (err) throw err;
	  	console.log('Completed!');
	  });


	  // run 2nd distance filter
	  var output2 = _.filter(people, function(item) {
	  	const coord = {
	  		latitude: parseFloat(item.location.latitude),
	  		longitude: parseFloat(item.location.longitude),
	  	};
	  	return haversine(Bristol_coord, coord, { unit: 'km' }) <= 200;
	  });

	  var value_sum = 0;
	  output2.forEach(function(item) {
	  	value_sum += parseFloat(item.value);
	  });

	  const average_value = value_sum / output2.length;
	  console.log('Average customer value of all people living within 200km of Bristol is ' + average_value + '!');
	});
};

app.listen(3000, function () {
  filter();
});