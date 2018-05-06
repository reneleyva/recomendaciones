console.log('Client-side code running');
jQuery(document).ready(function($) {
    $('#recomendar').click(function() {
        var pelis = $('#peliculas-input').val();
        if (pelis)
            $('#peliculas-form').submit();    
    });

    $('#search').autocomplete({
            source: function(req, res) {
                $.ajax({
                    url: "https://recomendaciones.herokuapp.com/"+req.term,    
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
    