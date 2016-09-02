$(function () {

    var server = {
        host: '52.34.181.81',
        port: '7890'
    };

    function hl(needle, haystack, cl) {
        var reg = new RegExp(needle, 'gi');
        return haystack.replace(reg, function(str) {
            return '<span class="' + cl + '">' + str + '</span>'
        });
    }

    function addMessage(msg) {
        var msgs = $('.prompt .message');
        var count = msgs.length;

        console.log("count= " + count);     //TODO(gb): Remove trace!!!

        msg = hl('GET|POST', msg, 'purple');
        msg = hl('HTTP\/1\.1|HTTP\/1\.0', msg, 'orange');
        msg = hl(':80', msg, 'red');
        msg = hl('\\[.*\\]', msg, 'green');
        msg = hl('(?:[0-9]{1,3}\.){3}[0-9]{1,3}', msg, 'blue');

        // if (count == 20)
        //     msgs.first().remove();

        $('<div />', {
            'class': 'message'
        })
            .html(msg)
            .appendTo($('.prompt'));
    }

    function toggleTerms() {
        if ($('.prompt').is(':empty')) {
            console.log('prompt is empty');        //TODO(gb): Remove trace!!!
            return;
        }

        console.log("$('.prompt-load').length= " + $('.prompt-load').length);     //TODO(gb): Remove trace!!!
        if ($('.prompt-load').length) {
            $('.prompt')
                .show();
        }
    }

    $('.prompt-load').typed({
        strings: [
            'Tailing live access logs from ' + server.host + '.^500.^1000.^1000.^1500.^1600.^1700.^1800.^1900.^2000.^3000.^4000.^5000.'
        ],
        typeSpeed: 0,
        showCursor: false,
        callback: function() {
            toggleTerms();
        },
    });
    var socket = new WebSocket('ws://' + server.host + ':' + server.port);

    // Socket open
    socket.onopen = function(event) {
        console.log('Socket open!');        //TODO(gb): Remove trace!!!
    };

    // Socket close
    socket.onclose = function(event) {
        toggleTerms();
        $('.prompt').html('<span class="red">:( Nope, the connection is out. Try again later!</span>');
    };

    socket.onerror = function (event) {
        console.log(event);        //TODO(gb): Remove trace!!!
    };

    socket.onmessage = function(event) {

        console.log(event);        //TODO(gb): Remove trace!!!

        var lines = event.data.split(/\n/);

        for (var i = 0; i < lines.length; ++i) {
            $.trim(lines[i]) != '' && addMessage($.trim(lines[i]));
        }

        toggleTerms();

    };
});