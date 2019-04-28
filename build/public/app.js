$(document).ready(function () {
    // Grab the articles as a json
    $.getJSON('/articles', function (data) {
        if (data.length > 0) {
            $('#articles').empty();
            // For each one
            for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                var article = renderArticleHome(data[i]);
                $('#articles').append(article);
            }
        }
    });
    function renderArticleHome(data) {
        var article = $('<div>').addClass('article')
            .html("\n      <div class=\"card\" style=\"width: 18rem;\">\n        <img src=" + data.image + " class=\"card-img-top\" alt=\"...\">\n        <i class=\"fas fa-cloud-download-alt save fa-2x\" data-id=" + data._id + "></i>\n        <div class=\"card-body\">\n          <a href=" + data.link + " target='_blank'><p class=\"card-text\">" + data.title + "</p></a>\n        </div>\n      </div>\n      ");
        return article;
    }
    function renderSaved(data) {
        var article = $('<div>').addClass('article')
            .html("\n      <div class=\"card\" style=\"width: 18rem;\">\n        <img src=" + data.image + " class=\"card-img-top\" alt=\"...\">\n        \n          <i class=\"fas fa-clipboard note fa-2x\" data-id=" + data._id + " class=\"noteButton\" type=\"button\" data-toggle=\"modal\" data-target=\"#exampleModalCenter\"></i>\n        \n        <i class=\"fas fa-minus-circle delete fa-2x\" data-id=" + data._id + "></i>\n        <div class=\"card-body\">\n          <a href=" + data.link + " target='_blank'><p class=\"card-text\">" + data.title + "</p></a>\n        </div>\n      </div>\n      ");
        return article;
    }
    // NaV clicks
    // Scarpe button
    $('#scrape').on('click', function () {
        $.ajax({
            method: 'GET',
            url: '/scrape'
        }).then(function (data) {
            console.log('scraped');
            $.getJSON('/articles', function (data) {
                if (data.length > 0) {
                    $('#articles').empty();
                    // For each one
                    for (var i = 0; i < data.length; i++) {
                        // Display the apropos information on the page
                        var article = renderArticleHome(data[i]);
                        $('#articles').append(article);
                    }
                }
            });
        });
    });
    $('#saved').on('click', function () {
        $.ajax({
            method: 'GET',
            url: '/saved'
        }).then(function (data) {
            // if (data.length > 0) {
            $('#articles').empty();
            // For each one
            for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                var article = renderSaved(data[i]);
                $('#articles').append(article);
            }
            // }
            // renderSaved(data);
        });
    });
    // clear db
    $('#clear').on('click', function () {
        $.ajax({
            method: 'GET',
            url: '/clear'
        }).then(function (res) {
            console.log('deleted');
            $('#articles').html('no articles. get scrapin');
        });
    });
    $('#home').on('click', function () {
        $.getJSON('/articles', function (data) {
            if (data.length > 0) {
                $('#articles').empty();
                // For each one
                for (var i = 0; i < data.length; i++) {
                    // Display the apropos information on the page
                    var article = renderArticleHome(data[i]);
                    $('#articles').append(article);
                }
            }
        });
    });
    // When user click's update button, update the specific note
    $(document).on('click', '.save', function () {
        // Save the selected element
        var selected = $(this);
        console.log(selected.attr('data-id'));
        // Make an AJAX POST request
        // This uses the data-id of the update button,
        // which is linked to the specific note title
        // that the user clicked before
        $.ajax({
            type: 'POST',
            url: "/save/" + selected.attr('data-id'),
            dataType: 'json',
            data: {
                saved: true
            },
            // On successful call
            success: function (data) {
                console.log('saved!');
            }
        });
    });
    // Whenever someone clicks a p tag
    $(document).on('click', 'p', function () {
        // Empty the notes from the note section
        $('#notes').empty();
        // Save the id from the p tag
        var thisId = $(this).attr('data-id');
        // Now make an ajax call for the Article
        $.ajax({
            method: 'GET',
            url: "/articles/" + thisId
        })
            // With that done, add the note information to the page
            .then(function (data) {
            console.log(data);
            // The title of the article
            $('#notes').append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $('#notes').append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $('#notes').append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $('#notes').append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $('#titleinput').val(data.note.title);
                // Place the body of the note in the body textarea
                $('#bodyinput').val(data.note.body);
            }
        });
    });
    // When you click the savenote button
    $(document).on('click', '#savenote', function () {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr('data-id');
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: 'POST',
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $('#titleinput').val(),
                // Value taken from note textarea
                body: $('#bodyinput').val()
            }
        })
            // With that done
            .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $('#notes').empty();
        });
        // Also, remove the values entered in the input and textarea for note entry
        $('#note-body').val('');
    });
    // unsave an article
    $(document).on('click', '.delete', function () {
        // Save the selected element
        var selected = $(this);
        console.log(selected.attr('data-id'));
        // Make an AJAX POST request
        // This uses the data-id of the update button,
        // which is linked to the specific note title
        // that the user clicked before
        $.ajax({
            type: 'POST',
            url: "/unsave/" + selected.attr('data-id'),
            dataType: 'json',
            data: {
                saved: false
            },
            // On successful call
            success: function (data) {
                console.log('article removed from saved');
            }
        }).then(function () {
            console.log('in it');
            $.getJSON('/saved', function (data) {
                $('#articles').empty();
                // For each one
                for (var i = 0; i < data.length; i++) {
                    // Display the apropos information on the page
                    var article = renderSaved(data[i]);
                    $('#articles').append(article);
                }
            });
        });
    });
    // Get request for getting a specific article and its populated "notes" when the note is clicked
    $(document).on('click', '.note', function () {
        // Empty the notes from the note section
        $('#notes-list').empty();
        // Save the id from the p tag
        var thisId = $(this).attr('data-id');
        $('#submit-note').attr('data-id', thisId);
        // Now make an ajax call for the Article
        $.ajax({
            method: 'GET',
            url: "/notes/" + thisId
        })
            // With that done, add the note information to the page
            .then(function (article) {
            console.log(article);
            $('#article-title').text(article.title);
            var notes = article.notes;
            notes.forEach(function (note) {
                console.log(note);
                var newNote = $('<li>').text(note.body);
                $('#notes-list').append(newNote);
            });
        });
    });
    // submitting a note
    $(document).on('click', '#submit-note', function () {
        var thisId = $(this).attr('data-id');
        var noteBody = $('#note-body').val();
        // Now make an ajax call for the Article
        $.ajax({
            method: 'POST',
            url: "/note/" + thisId,
            data: {
                body: noteBody
            }
        })
            // With that done, add the note information to the page
            .then(function (req, response) {
            $('#note-body').val('');
            var newNote = $('<li>').text(response);
            $('#notes-list').append(newNote);
        });
    });
}); // end doc
//# sourceMappingURL=app.js.map