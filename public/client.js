console.log('Client-side code running');

$('#search').autocomplete({
        source: function(req, res) {
            $.ajax({
                url: "http://localhost:8080/autocomplete/"+req.term,
                dataType: "json",
                type: "GET",
                data: {
                    term: req.term
                },
                success: function(data) {
                    res($.map(data, function(item) {	
                        return {
                            label: item.title,//text comes from a collection of mongo
                            value: item._id
                        };
                    }));
                },
                error: function(xhr) {
                    console.log(xhr.status + ' : ' + xhr.statusText);
                }
            });
        },
        select: function(event, ui) {
        	var movieId = ui.item.value;
        	var title = ui.item.label;
        	console.log(title);
        	$('#movie-titles').append(`<li>${title}</li>`);
        	var tmp = $('#peliculas-input').val();
        	$('#peliculas-input').val(tmp + "," + movieId);
        	ui.item.value = "";
        }
    });