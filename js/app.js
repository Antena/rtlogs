'use strict';

$(function () {

    /**
     * //TODO(gb): add docs
     *
     * @param terminalId
     * @param terminalName
     * @param serverHost
     */
    var tailLog = function(terminalId, terminalName, serverHost) {
        var server = {
            host: serverHost,
            port: '7890'
        };

        // Socket
        var socket = new WebSocket('ws://' + server.host + ':' + server.port);

        // Socket open
        socket.onopen = function() {
            console.log('Socket open...');
        };

        // Socket close
        socket.onclose = function() {
            toggleTerms(terminalId);
            $('#' + terminalId + ' .prompt').html('<span class="red">:( Nope, the connection is out. Try again later!</span>');
        };

        // Socket message
        socket.onmessage = function(event) {
            console.log('New message');

            var lines = event.data.split(/\n/);

            for (var i = 0; i < lines.length; ++i) {
                $.trim(lines[i]) != '' && addMessage(terminalId, $.trim(lines[i]));
            }

            toggleTerms(terminalId);

        };

        $('#' + terminalId +' .prompt-load').typed({
            strings: [
                'Tailing live access logs for ' + terminalName + ' ('  + server.host + ') ^500.^1000.^1000.'
            ],
            typeSpeed: 0,
            showCursor: false,
            callback: function() {
                toggleTerms();
            }
        });
    };


    /**
     * add docs
     *
     * @param needle
     * @param haystack
     * @param cl
     * @returns {void|string|XML}
     */
    function hl(needle, haystack, cl) {
        var reg = new RegExp(needle, 'gi');
        return haystack.replace(reg, function(str) {
            return '<span class="' + cl + '">' + str + '</span>'
        });
    }

    /**
     * //TODO(gb): add docs
     *
     * @param terminalId
     * @param msg
     */
    function addMessage(terminalId, msg) {
        var msgs = $('#' + terminalId + ' .prompt .message'),
            count = msgs.length;

        msg = hl('GET|POST', msg, 'purple');
        msg = hl('HTTP\/1\.1|HTTP\/1\.0', msg, 'orange');
        msg = hl(':80', msg, 'red');
        msg = hl('\\[.*\\]', msg, 'green');
        msg = hl('(?:[0-9]{1,3}\.){3}[0-9]{1,3}', msg, 'blue');

        var prompt = $('#' + terminalId + ' .prompt');
        var msgElem = $('<div />', { 'class': 'message' })
            .html(msg)
            .appendTo(prompt);


        var height = msgElem.height() * count;
        prompt.animate({ scrollTop: height }, "slow");
    }

    /**
     * //TODO(gb): add docs
     */
    var toggleTerms = function(terminalId) {
        var prompt = $('#' + terminalId + ' .prompt');
        if (prompt.is(':empty')) {
            return;
        }

        if ($('#' + terminalId +' .prompt-load').length) {
            prompt.show();
        }
    };


    // Init terminals
    tailLog('fhir-middleware', 'FHIR Middleware', '52.41.254.244');
    tailLog('lab-explorer', 'Lab Explorer', '52.34.181.81');
});