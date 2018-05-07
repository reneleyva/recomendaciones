jQuery(document).ready(function($) {
    // Evento click del botón recomiendame de index. 
    $('#recomendar').click(function() {
        var pelis = $('#peliculas-input').val();
        if (pelis)
            $('#peliculas-form').submit();    
    });

    // Para autocomplete de jquery ui 
    $('#search').autocomplete({
            source: function(req, res) {
                $.ajax({
                    url: "https://recomendaciones.herokuapp.com/autocomplete/"+req.term,    
                    // url: "http://localhost:5000/autocomplete/"+req.term,
                    dataType: "json",
                    type: "GET",
                    data: {
                        term: req.term
                    },
                    success: function(data) {
                        if (data.length == 0) {
                            res([{
                                label: "No Encontrado",
                                value: ""
                            }]);
                            
                        } else {
                            res($.map(data, function(item) {    
                                return {
                                    label: item.title,
                                    value: item._id
                                };
                            }));
                        }
                        
                    },
                    error: function(xhr) {
                        console.log(xhr.status + ' : ' + xhr.statusText);
                    }
                });
            },

            // Cuando se selecciona se agrega a la lista y a un formulario escondido
            select: function(event, ui) {
                var movieId = ui.item.value;
                if (!movieId)
                    return; 

                var title = ui.item.label;
                $('#movie-titles').append(`<li>${title}</li>`);
                var tmp = $('#peliculas-input').val();
                if (!tmp)
                   $('#peliculas-input').val(movieId);
                else 
                   $('#peliculas-input').val(tmp + "," + movieId);

                ui.item.value = "";
            }
        });
});
    