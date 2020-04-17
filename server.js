var fs = require('fs');

var data = fs.readFileSync('website/Lum_Configs/Luminaria_8.json');
var data2 = fs.readFileSync('website/Lum_Configs/Network_Elements.json');

var Luminaria_8 = JSON.parse(data);
var Network_Elements = JSON.parse(data2);

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var server = app.listen(3000, listening);

function listening(){
	console.log("listening...");
}

app.use(express.static('website'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/analyze', analyzeThis);

function analyzeThis(request, response){
	console.log('Request body:');
	console.log(request.body);
	
	var data_received = request.body;
	var column_name;
	var list = [];
	
	for(column_name in data_received){
		list.push(column_name);
	}
	
	for(var y=0; y < list.length; y++)
	{
		Luminaria_8[list[y]] = data_received[list[y]];
		//Luminaria_13[list[y]] = data_received[list[y]];
	}
		
	var data = JSON.stringify(Luminaria_8, null, 2);
	console.log('data JSON stringify');
	console.log(data);
	fs.writeFile('website/Lum_Configs/Luminaria_8.json', data, finished);
	
	function finished(err){
		
		if(err)
		{
			console.log('Error analyzeThis');
			console.log(err);
			response.send(err);
		}	
	}	
}

app.get('/get_luminaria_ip/:_Luminaria', function(req, res){
  
  var data = req.params;
  var Luminaria = data._Luminaria;
  res.send(Network_Elements[Luminaria]);
 });

app.get('/get_network_elements', function(req, res){
  
  console.log(req);
  res.send(JSON.stringify(Network_Elements));
 });
 
/*
app.get('/search/:flower', sendFlower);

function sendFlower(request, response){

		var data = request.params;
		response.send("I love " + data.flower + " too");
}

app.get('/add/:word/:score', addWord);

function addWord(request, response){
	
	var data = request.params;
	var word = data.word;
	var score = Number(data.score);
	
	//words[word] = score;
	
	var data = JSON.stringify(words, null, 2);
	fs.writeFile('LED.json', data, finished);
	
	function finished(err){
		
		var reply = {
		word: word,
		score: score,
		status: "success"
		}
		
		response.send(reply);
	}
}*/
	