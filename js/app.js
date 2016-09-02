$(function () {

    var server = {
        host: '52.34.181.81',
        port: '7890'
    };

    /**
     * @param needle
     * @param haystack
     * @param cl
     * @returns {string|XML|void}
     */
    function hl(needle, haystack, cl) {
        var reg = new RegExp(needle, 'gi');
        return haystack.replace(reg, function(str) {
            return '<span class="' + cl + '">' + str + '</span>'
        });
    }

    function addMessage(msg) {
        var msgs = $('.prompt .message');
        var count = msgs.length;

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
            return;
        }

        if ($('.prompt-load').length) {
            $('.prompt')
                .show();
        }
    }

    $('.prompt-load').typed({
        strings: [
            'Tailing live access logs from ' + server.host + '^500.^1000.^1000.'
        ],
        typeSpeed: 0,
        showCursor: false,
        callback: function() {
            toggleTerms();
        }
    });

    // Socket
    var socket = new WebSocket('ws://' + server.host + ':' + server.port);

    // Socket open
    socket.onopen = function(event) {
        console.log('Socket open...');
    };

    // Socket close
    socket.onclose = function(event) {
        toggleTerms();
        $('.prompt').html('<span class="red">:( Nope, the connection is out. Try again later!</span>');
    };

    // Socket message
    socket.onmessage = function(event) {
        console.log('New message');

        var lines = event.data.split(/\n/);

        for (var i = 0; i < lines.length; ++i) {
            $.trim(lines[i]) != '' && addMessage($.trim(lines[i]));
        }

        toggleTerms();

    };
});