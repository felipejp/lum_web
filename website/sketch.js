var Network_Elements = {};

$(document).ready(function(){

	console.log('sketch running');
	
	$.get( '/get_network_elements', function( data ) {
		
		Network_Elements = JSON.parse(data);
	});
	
	$("#submit_nivel_luminosidad").click(function(){
		submitNivelLuminosidad();
	});
	
	$("#submit_sens_mov").click(function(){
		submitSensMov();
	});
	
	$("#submit_config_estados").click(function(){
		submitStates()
	});
		
	$("#get_configuracion").click(function(){
		get_Configuracion()
	});
	
	$("#wifi_config").click(function(){
		enviar_WiFi_config()
	});
	
	$("#identificar").click(function(){
		enviar_Identificar()
	});
	
	var elegir_luminaria = document.getElementById('elegir_luminaria');
	var get_configuracion = document.getElementById("get_configuracion");
	var identificar = document.getElementById("identificar");
	
	var ssid = document.getElementById("ssid");
	var password = document.getElementById("password");
	
	var modo_manual = document.getElementById("modo_manual");
	var modo_automatico = document.getElementById("modo_automatico");	
	
	var estados_dimmer = document.getElementById("estados_dimmer");
	var selec_luz_sin_mov = document.getElementById("selec_luz_sin_mov");
	var selec_luz_con_mov = document.getElementById("selec_luz_con_mov");
	
	var selec_luz_sin_mov_title = document.getElementById("selec_luz_sin_mov_title");
	var selec_luz_con_mov_title = document.getElementById("selec_luz_con_mov_title");
	var tiempo_encendido_title_1 = document.getElementById("tiempo_encendido_title_1");
	
	var selec_inicio_E1 = document.getElementById("selec_inicio_E1");
	var E1_reposo_movimiento = document.getElementById("E1_reposo_movimiento");
	var selec_inicio_E2 = document.getElementById("selec_inicio_E2");
	var E2_reposo_movimiento = document.getElementById("E2_reposo_movimiento");
	var selec_inicio_E3 = document.getElementById("selec_inicio_E3");
	var E3_reposo_movimiento = document.getElementById("E3_reposo_movimiento");
	
	var hora_inicio_estado_1 = document.getElementById("hora_inicio_estado_1");
	var hora_inicio_estado_2 = document.getElementById("hora_inicio_estado_2");
	var hora_inicio_estado_3 = document.getElementById("hora_inicio_estado_3");
	var minutos_inicio_estado_1 = document.getElementById("minutos_inicio_estado_1");
	var minutos_inicio_estado_2 = document.getElementById("minutos_inicio_estado_2");
	var minutos_inicio_estado_3 = document.getElementById("minutos_inicio_estado_3");
	var estado_1_reposo = document.getElementById("estado_1_reposo");
	var estado_1_mov = document.getElementById("estado_1_mov");
	var estado_2_reposo = document.getElementById("estado_2_reposo");
	var estado_2_mov = document.getElementById("estado_2_mov");
	var estado_3_reposo = document.getElementById("estado_3_reposo");
	var estado_3_mov = document.getElementById("estado_3_mov");
	var tiempo_encendido_title_2 = document.getElementById("tiempo_encendido_title_2");
	var submit_config_estados = document.getElementById("submit_config_estados");
	
	var tiempo_encendido = document.getElementById("tiempo_encendido");
	var tiempo_encendido_2 = document.getElementById("tiempo_encendido_2");
	
	//Al elegir luminaria, habilita todas las opciones y las resetea.
	////////////////////////////////////////////////////////////////////////////////////////
	elegir_luminaria.onchange = function Enable_and_Reset_Options(){
		
		modo_manual.selectedIndex = 0;
		estados_dimmer.selectedIndex = 0;
		selec_luz_sin_mov.selectedIndex = 0;
		selec_luz_con_mov.selectedIndex = 0;
		hora_inicio_estado_1.selectedIndex = 0;
		hora_inicio_estado_2.selectedIndex = 0;
		hora_inicio_estado_3.selectedIndex = 0;
		minutos_inicio_estado_1.selectedIndex = 0;
		minutos_inicio_estado_2.selectedIndex = 0;
		minutos_inicio_estado_3.selectedIndex = 0;
		estado_1_reposo.selectedIndex = 0;
		estado_1_mov.selectedIndex = 0;
		estado_2_reposo.selectedIndex = 0;
		estado_2_mov.selectedIndex = 0;
		estado_3_reposo.selectedIndex = 0;
		estado_3_mov.selectedIndex = 0;
		
		Esconder_Estados_Dimmer_Manual();
		
		if(elegir_luminaria.selectedIndex != 0){
			
			modo_manual.removeAttribute("disabled");
			
			get_configuracion.removeAttribute("disabled");
			identificar.removeAttribute("disabled");
			
			ssid.removeAttribute("disabled");
			ssid.value = "";
			password.removeAttribute("disabled");
			password.value = "";
		}
		else{
			
			modo_manual.setAttribute("disabled", "");
			estados_dimmer.setAttribute("disabled", "");
			
			get_configuracion.setAttribute("disabled", "");
			identificar.setAttribute("disabled", "");
			
			ssid.setAttribute("disabled", "");
			ssid.value = "";
			password.setAttribute("disabled", "");
			password.value = "";
		}
		
		
	}
	////////////////////////////////////////////////////////////////////////////////////////
	modo_manual.onchange = function Enable_Disable_Modo_Manual(){
		
		if(modo_manual.value == "SI")
			{
				estados_dimmer.removeAttribute("disabled");
				
				modo_automatico.setAttribute("disabled", "");
				modo_automatico.selectedIndex = 0;
				
				Aparecer_Estados_Dimmer_Manual();
				Esconder_Opciones_Sensor();
				Esconder_Opciones_Estados();
			}	
			else if(modo_manual.value == "NO")
			{
				modo_automatico.removeAttribute("disabled");
				modo_automatico.selectedIndex = 0;
				
				Esconder_Estados_Dimmer_Manual();
				Esconder_Opciones_Sensor();
				Esconder_Opciones_Estados();
			}
			else if(modo_manual.selectedIndex == 0)
			{
				Esconder_Estados_Dimmer_Manual();
				Esconder_Opciones_Sensor();
				Esconder_Opciones_Estados();
				
				modo_automatico.setAttribute("disabled", "");
				modo_automatico.selectedIndex = 0;
			}	
	}
	
	modo_automatico.onchange = function Enable_Disable_Modo_Automatico(){
		
		if(modo_automatico.value == "SENSOR")
			{				
				Aparecer_Opciones_Sensor();
				Esconder_Opciones_Estados();
			}	
			else if(modo_automatico.value == "ESTADOS")
			{
				Aparecer_Opciones_Estados();
				Esconder_Opciones_Sensor();
			}
			else if(modo_automatico.selectedIndex == 0)
			{
				Esconder_Opciones_Sensor();
				Esconder_Opciones_Estados();
			}	
	}
});

function submitNivelLuminosidad(){
		
	var x = document.getElementById("estados_dimmer");
	var Modo_Manual = document.getElementById('modo_manual').value;
	var Modo_Automatico = document.getElementById('modo_automatico').value;
	
	if(x.selectedIndex == ""){
		alert("Elija un nivel de luminosidad");
		return;
	}
	
	var data ={
		Modo_Manual: Modo_Manual,
		Modo_Automatico: Modo_Automatico,
		Dimmer: x.value
	}
	
	var device = document.getElementById('elegir_luminaria').value
	var ip = Network_Elements[device];
	var url = "http://" + ip + "/config";
			
	$.post('/analyze', data,
		
		function(data,status){
		alert("Data: " + data + "\nStatus: " + status);
	}, 'json');
	
	setTimeout(function() {
		$.post(url, {"Motivo": "Dimmer"},
		
			function(data,status){
			alert("Data: " + data + "\nStatus: " + status);
		});
	}, 100);
}

function submitSensMov(){
	
	var x = document.getElementById("selec_luz_sin_mov");
	var y = document.getElementById("selec_luz_con_mov");
	var t = document.getElementById("tiempo_encendido");
	
	if(x.selectedIndex == ""	||	y.selectedIndex == ""	||	t.selectedIndex == ""){
		console.log("Vacio");
		alert("Complete todos los campos");
	}
	
	if(isNaN(t.value))
	{
		alert("Ingrese un valor de tiempo valido");
	}	
	
	var Modo_Manual = document.getElementById('modo_manual').value;
	var Modo_Automatico = document.getElementById('modo_automatico').value;
	var Luz_Defecto_Sin_Mov = document.getElementById('selec_luz_sin_mov').value;
	var Luz_Con_Mov = document.getElementById('selec_luz_con_mov').value;
	var Tiempo_Luz_Mov = t.value;
	
	var data = {
		Modo_Manual: Modo_Manual,
		Modo_Automatico: Modo_Automatico,
		Luz_Defecto_Sin_Mov: Luz_Defecto_Sin_Mov,
		Luz_Con_Mov: Luz_Con_Mov,
		Tiempo_Luz_Mov: Tiempo_Luz_Mov
	}
	
	var device = document.getElementById('elegir_luminaria').value
	var ip = Network_Elements[device];
	var url = "http://" + ip + "/config";
	
	$.post('/analyze', data,
		
		function(data,status){
		console.log(data);
		console.log('status: ' + status);
		});
		
	setTimeout(function() {
		$.post(url, {"Motivo": "Sens_Mov"},
		
			function(data,status){
			alert("Data: " + data + "\nStatus: " + status);
			});
	}, 100);
}

function submitStates(){
	
	var mm = document.getElementById("modo_manual").value;
	var ma = document.getElementById("modo_automatico").value;
	var h1 = document.getElementById("hora_inicio_estado_1").value;
	var h2 = document.getElementById("hora_inicio_estado_2").value;
	var h3 = document.getElementById("hora_inicio_estado_3").value;
	var m1 = document.getElementById("minutos_inicio_estado_1").value;
	var m2 = document.getElementById("minutos_inicio_estado_2").value;
	var m3 = document.getElementById("minutos_inicio_estado_3").value;
	var L1r = document.getElementById("estado_1_reposo").value;
	var L1m = document.getElementById("estado_1_mov").value;
	var L2r = document.getElementById("estado_2_reposo").value;
	var L2m = document.getElementById("estado_2_mov").value;
	var L3r = document.getElementById("estado_3_reposo").value;
	var L3m = document.getElementById("estado_3_mov").value;
	var t = document.getElementById("tiempo_encendido_2").value;
		
	if(h1 == "" || h2 == "" || h3 == "" || m1 == "" ||	m2 == "" || m3 == "" || L1r == "" || L1m == ""	||	L2r == "" || L2m == ""	||	L3r == "" || L3m == ""
						||	t == "")
	{
		alert("Complete todos los datos");
		return;
	}
	
	if(isNaN(t))
	{
		alert("Ingrese un valor de tiempo valido");
	}
	//Chequear que la hora final (E3) sea menor a la hora inicial (E1)
	if(h3 >= h1)
	{
		if(h3 < h2)
		{
			alert("La hora de inicio del Estado_3 debe ser menor a la hora de inicio del Estado_1");
			return;
		}	
	}
	
	var data ={
		Modo_Manual : mm,
		Modo_Automatico : ma,
		Horas_Inicio_Estado_1 : h1,
		Minutos_Inicio_Estado_1 : m1,
		Horas_Inicio_Estado_2 : h2,
		Minutos_Inicio_Estado_2 : m2,
		Horas_Inicio_Estado_3 : h3,
		Minutos_Inicio_Estado_3 : m3,
		Estado_1_Reposo : L1r,
		Estado_1_Mov : L1m,
		Estado_2_Reposo : L2r,
		Estado_2_Mov : L2m,
		Estado_3_Reposo : L3r,
		Estado_3_Mov : L3m,
		Tiempo_Luz_Mov: t
	}
	
	var device = document.getElementById('elegir_luminaria').value;
	var ip = Network_Elements[device];
	var url = "http://" + ip + "/config";
		
	$.post('/analyze', data,
		
	function(data,status){
	alert("Data: " + data + "\nStatus: " + status);
	});
		
	setTimeout(function() {
		$.post(url, {"Motivo": "States"},
		
		function(data,status){
		alert("Data: " + data + "\nStatus: " + status);
		});
	}, 100);	
}

function get_Configuracion(){
	
	var device = elegir_luminaria.value;
	var ip = Network_Elements[device];
	
	var data2;

	var url = "http://" + ip + "/get_config";
		
	$.get( url, function( data ) {

		data2 = data;
	});
	
	setTimeout(function() {
		var message = "Dispositivo: " + data2["Dispositivo"] +  "\n" +
							"Modo Manual: " + data2["Modo_Manual"] + "\n";
		
		if(data2["Modo_Manual"] == "NO")
		{
			message += "Modo Automatico: " + data2["Modo_Automatico"] + "\n";
			
			if(data2["Modo_Automatico"] == "SENSOR")
			{
				message += "Luz sin movimiento: " + data2["Luz_Defecto_Sin_Mov"] + "   " + "Luz con movimiento: " + data2["Luz_Con_Mov"] + "\n";
				message += "Tiempo de encendido: " + data2["Tiempo_Luz_Mov"] + " segundos";
			}
			else
			{
				message += "Hora de inicio de Estado_1: ";
				if(data2["Horas_Inicio_Estado_1"] < 10)
				{
					message += "0";
				}

				message += data2["Horas_Inicio_Estado_1"] + ":";
		
				if(data2["Minutos_Inicio_Estado_1"] < 10)
				{
					message += "0";
				}
		
				message += data2["Minutos_Inicio_Estado_1"] + " hs" + "\n" + "Estado_1_Reposo: " + data2["Estado_1_Reposo"] + " " +  
						"Estado_1_Movimiento: " + data2["Estado_1_Mov"] + "\n";
		
				message += "Hora de inicio de Estado_2: ";
				if(data2["Horas_Inicio_Estado_2"] < 10)
				{
					message += "0";
				}

				message += data2["Horas_Inicio_Estado_2"] + ":";
		
				if(data2["Minutos_Inicio_Estado_2"] < 10)
				{
					message += "0";
				}
		
				message += data2["Minutos_Inicio_Estado_2"] + " hs" + "\n" + "Estado_2_Reposo: " + data2["Estado_2_Reposo"]  + " " + 
						"Estado_2_Movimiento: " + data2["Estado_2_Mov"] + "\n";
		
				message += "Hora de inicio de Estado_3: ";
				if(data2["Horas_Inicio_Estado_3"] < 10)
				{
					message += "0";
				}

				message += data2["Horas_Inicio_Estado_3"] + ":";
		
				if(data2["Minutos_Inicio_Estado_3"] < 10)
				{
					message += "0";
				}
				
				message += data2["Minutos_Inicio_Estado_3"] + " hs" + "\n" + "Estado_3_Reposo: " + data2["Estado_3_Reposo"]  + " " + 
						"Estado_3_Movimiento: " + data2["Estado_3_Mov"] + "\n";
				
				message += "Tiempo de encendido: " + data2["Tiempo_Luz_Mov"] + " segundos";
			}	
		}
		else
		{
				message += "Dimmer configurado: " + data2["Dimmer"] + "\n";
		}
		alert(message);
	}, 2000);
}

function enviar_WiFi_config(){
	
	if(ssid.value == ""	||	password.value == ""){
		alert("Complete todos los campos");
		return;
	}
	
	var device = elegir_luminaria.value;
	var ip = Network_Elements[device];

	var url = "http://" + ip + "/wifi_from_server";
	
	var data = { "ssid": ssid.value,
				 "password": password.value }
		
	$.post(url, data, function(data,status){});
}

function enviar_Identificar(){
	
	var device = document.getElementById('elegir_luminaria').value
	var ip = Network_Elements[device];
		
	var url = "http://" + ip + "/identificar";
		
	$.post(url, {"Motivo": "Identificar"}, function(data,status){});
}

function Esconder_Estados_Dimmer_Manual() {
				
	estados_dimmer.setAttribute("hidden", "");
	selec_nivel_lum.setAttribute("hidden", "");
	submit_nivel_luminosidad.setAttribute("hidden", "");
}

function Aparecer_Estados_Dimmer_Manual() {
	
	estados_dimmer.removeAttribute("hidden");
	estados_dimmer.selectedIndex = 0;
	selec_nivel_lum.removeAttribute("hidden");
	selec_nivel_lum.selectedIndex = 0;
	submit_nivel_luminosidad.removeAttribute("hidden");
}		

function Aparecer_Opciones_Sensor() {

	selec_luz_sin_mov_title.removeAttribute("hidden");
	selec_luz_con_mov_title.removeAttribute("hidden");
	tiempo_encendido_title_1.removeAttribute("hidden");
	
	selec_luz_sin_mov.removeAttribute("hidden");
	selec_luz_sin_mov.selectedIndex = 0;
	selec_luz_con_mov.removeAttribute("hidden");
	selec_luz_con_mov.selectedIndex = 0;
	tiempo_encendido.removeAttribute("hidden");
	tiempo_encendido.value = "";
	
	submit_sens_mov.removeAttribute("hidden");
}

function Esconder_Opciones_Estados() {
	
	selec_inicio_E1.setAttribute("hidden", "");
	E1_reposo_movimiento.setAttribute("hidden", "");
	selec_inicio_E2.setAttribute("hidden", "");
	E2_reposo_movimiento.setAttribute("hidden", "");
	selec_inicio_E3.setAttribute("hidden", "");
	E3_reposo_movimiento.setAttribute("hidden", "");
	
	hora_inicio_estado_1.setAttribute("hidden", "");
	minutos_inicio_estado_1.setAttribute("hidden", "");
	hora_inicio_estado_2.setAttribute("hidden", "");
	minutos_inicio_estado_2.setAttribute("hidden", "");
	hora_inicio_estado_3.setAttribute("hidden", "");
	minutos_inicio_estado_3.setAttribute("hidden", "");
	tiempo_encendido_title_2.setAttribute("hidden", "");
	tiempo_encendido_2.setAttribute("hidden", "");
	submit_config_estados.setAttribute("hidden", "");
}

function Aparecer_Opciones_Estados() {
	
	selec_inicio_E1.removeAttribute("hidden");
	E1_reposo_movimiento.removeAttribute("hidden");
	selec_inicio_E2.removeAttribute("hidden");
	E2_reposo_movimiento.removeAttribute("hidden");
	selec_inicio_E3.removeAttribute("hidden");
	E3_reposo_movimiento.removeAttribute("hidden");
	
	hora_inicio_estado_1.removeAttribute("hidden");
	hora_inicio_estado_1.selectedIndex = 0;
	minutos_inicio_estado_1.removeAttribute("hidden");
	minutos_inicio_estado_1.selectedIndex = 0;
	hora_inicio_estado_2.removeAttribute("hidden");
	hora_inicio_estado_2.selectedIndex = 0;
	minutos_inicio_estado_2.removeAttribute("hidden");
	minutos_inicio_estado_2.selectedIndex = 0;
	hora_inicio_estado_3.removeAttribute("hidden");
	hora_inicio_estado_3.selectedIndex = 0;
	minutos_inicio_estado_3.removeAttribute("hidden");
	minutos_inicio_estado_3.selectedIndex = 0;
			
	estado_1_reposo.removeAttribute("hidden");
	estado_1_reposo.selectedIndex = 0;
	estado_1_mov.removeAttribute("hidden");
	estado_1_mov.selectedIndex = 0;
	estado_2_reposo.removeAttribute("hidden");
	estado_2_reposo.selectedIndex = 0;
	estado_2_mov.removeAttribute("hidden");
	estado_2_mov.selectedIndex = 0;
	estado_3_reposo.removeAttribute("hidden");
	estado_3_reposo.selectedIndex = 0;
	estado_3_mov.removeAttribute("hidden");
	estado_3_mov.selectedIndex = 0;
				
	tiempo_encendido_title_2.removeAttribute("hidden");
	tiempo_encendido_2.removeAttribute("hidden");
	tiempo_encendido_2.value = "";
	
	submit_config_estados.removeAttribute("hidden");
}

function Esconder_Opciones_Sensor() {
	
	selec_luz_sin_mov_title.setAttribute("hidden", "");
	selec_luz_con_mov_title.setAttribute("hidden", "");
	tiempo_encendido_title_1.setAttribute("hidden", "");
	
	selec_luz_sin_mov.setAttribute("hidden", "");
	selec_luz_con_mov.setAttribute("hidden", "");
	tiempo_encendido.setAttribute("hidden", "");
	
	submit_sens_mov.setAttribute("hidden", "");
}	