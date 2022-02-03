$(document).ready(function (){

    //Se Crea un contrusctor de reservas
    class Reservas{
        constructor(deporte, ciudad, fecha, hora){
            this.deporte = deporte
            this.ciudad = ciudad    
            this.fecha = fecha
            this.hora = hora
        }
    }

    //Se crea un array de datos de reservas almacenadas en el LocalStorage
    let listaReservas = JSON.parse(localStorage.getItem('Lista de reservas'))

    //Funcion con la que voy a guardar la info de mis reservas en el LocalStorage
    const almacenarReserva = (nuevaReserva) => {
        listaReservas.push(nuevaReserva)
        localStorage.setItem('Lista de reservas', JSON.stringify(listaReservas))
    }
    
    //Si no hay ninguna reserva en el storage se inicializa la lista de array vacía
    if (!listaReservas) {
        listaReservas = []
    }
       
    let btnReservar = document.querySelector("#btn-enviar")
    
    //Registro de reserva - 
    btnReservar.addEventListener("click",function(e){
        
        e.preventDefault()

        //Recibe los valores de los inputs y selects        
        const deporte = $("#miSelectDeporte").val()
        const ciudad = $("#miSelectCiudad").val()
        const fecha = $("#miInputFecha").val()
        const hora = $("#miInputHora").val()
    
        const reserva1 = new Reservas(deporte, ciudad, fecha, hora)
        almacenarReserva(reserva1)

        //Traigo elementos del DOM sin embargo utilizo JQuery para practicar posteriormente
        let divFormulario = document.getElementById("reservas")
        let divReservaHecha = document.getElementById("divReservasHechas")
        let formulario = document.getElementById("miForm")
        let divTitulo = document.getElementById("divTitulo")

        //Registro mi reserva y se refleja en una lista
        let itemReservas = $("#miListaUl").append(`<li id="itemReserva">Ud. acaba de reservar un complejo para jugar un encuentro de ${listaReservas[0].deporte} a disputarse el día ${listaReservas[0].fecha} a las ${listaReservas[0].hora} en la ciudad de ${listaReservas[0].ciudad}</li>`)
        itemReservas.css({"width":"70%"})
            
        //Se extraen datos del array para reflejarlos en la reserva
        itemReservas.deporte = listaReservas[0].deporte
        itemReservas.fecha = listaReservas[0].fecha
        itemReservas.ciudad = listaReservas[0].ciudad
        itemReservas.hora = listaReservas[0].hora
    
        //Se mostrará solo una reserva pero se podra iterar todo el array de la siguiente forma:
        /* for (let i = 0; i < listaReservas.length; i++) {
            

            let itemReservas = $("#miListaUl").append(`<li id="itemReserva">Ud. acaba de reservar un complejo para jugar un encuentro de ${listaReservas[i].deporte} a disputarse el día ${listaReservas[i].fecha} a las ${listaReservas[i].hora} en la ciudad de ${listaReservas[i].ciudad}</li>`)
            itemReservas.css({"width":"70%"})
            
            //Se extraen datos del array para reflejarlos en la reserva
            itemReservas.deporte = listaReservas[i].deporte
            itemReservas.fecha = listaReservas[i].fecha
            itemReservas.ciudad = listaReservas[i].ciudad
            itemReservas.hora = listaReservas[i].hora
    
        } */ 
          
        //Se apaga el formulario para mostrar solo la reserva realizada
        $(formulario).css({"display":"none"})
                
        //Se intercambia el contenedor del formulario por otro con la reserva realizada
        divFormulario.setAttribute("id","divReservasHechas")
        $(divReservaHecha).css({"align-content": "center"})

        //Creación de titulo
        $(divTitulo).prepend(`<h1 id="tituloResRealizada">RESERVAS REALIZADAS</h1>`)
        $("#tituloResRealizada").css({"color": "white","text-align":"center"})
        $(divReservaHecha).prepend(divTitulo)
        
        //Inserto boton para borrar reserva y volver al div original
        $(divReservaHecha).append(`<button class="btn btn-primary" type="reset" value="Borrar Campos" id="btn-nuevaReserva">Nueva Reserva</button>`)

        $("#btn-nuevaReserva").click(function (){

            //Elimino reserva realizada
            $("#tituloResRealizada").remove();

            //Retorno al formulario original
            divReservaHecha.setAttribute("id","reservas");
            $("#miForm").css({"display":"block"});
            $(divReservaHecha).css({"display":"none"});
            localStorage.clear();
            location.reload()
        })
              
        //Se emplea el metodo get mediante AJAX para consulta de API del clima
        $("#miSelectCiudad").val(function (){
            
            //Se captura la locaciòn del complejo seleccionado
            let selectorCiudad = $("#miSelectCiudad option:selected").val()
            
            //URL de API
            let url = `http://api.openweathermap.org/data/2.5/weather?q=${selectorCiudad}&appid=757a2e3a4a8ba3a6b556b073dfd80963`
        
            //Consulta a API
            $.get(url, function (datos){
          
                console.log(datos)
                let longitud = datos.coord.lat
                let latitud = datos.coord.lon
    
                //Mapa insertado segùn latitud y longitud de la ciudad seleccionada (a futuro del complejo seleccionado)
                $("#mapa").append(`<iframe data-aos="zoom-in" data-aos-duration="2000" data-aos-delay="100" class="mapaApi" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13391.575983245193!2d${latitud}!3d${longitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1621955786207!5m2!1ses-419!2sar" ></iframe>`)
                //El nuevo mapa reemplaza al ya existente por defecto
                $(".mapa").replaceWith($(".mapaApi"))
                $(".mapaApi").css({"width": "100%", "height": "92%", "padding-top": "10px", "padding-bottom": "20px"})
                
                //Array con iconos de distintos climas
                let imgs = [
                    ["Soleado", "https://cdn-0.imagensemoldes.com.br/wp-content/uploads/2018/06/Imagem-Sol-Sol-Brilhando-PNG.png"],
                    ["Nublado", "https://imagensemoldes.com.br/wp-content/uploads/2020/04/Ilustra%C3%A7%C3%A3o-de-Nuvem-PNG--346x188.png"],
                    ["Lluvioso", "https://cdn.icon-icons.com/icons2/1461/PNG/512/2998141-cloud-nature-rain-weather_99845.png"]]
                
                //Se mostrarà el icono correspondiente según el clima de la ciudad
                if(datos.weather[0].description == "clear sky"){
                    $("#divListaReservas").append(`
                    <div id="imgClima">
                        <p id="tipoClima">Clima actual: ${imgs[0][0]}</p>
                        <img id="imagen" src="${imgs[0][1]}"></img>
                    </div>`)            
                }else if(datos.weather[0].description == "broken clouds" || "scattered clouds"){
                    $("#divListaReservas").append(`
                    <div id="imgClima">
                        <p id="tipoClima">Clima actual: ${imgs[1][0]}</p>
                        <img id="imagen" src="${imgs[1][1]}"></img>
                    </div>`)
                }else if(datos.weather[0].description == "rain"){
                    $("#divListaReservas").append(`
                    <div id="imgClima">
                        <p id="tipoClima">Clima actual: ${imgs[2][0]}</p>
                        <img id="imagen" src="${imgs[2][1]}"></img>
                    </div>`)
    
}
})
})
})
})