/*! Video Embed - v1
 *  Copyright (c) 2016 Mattias Hinderson
 *  License: MIT
 */

(function (window, factory) {
    'use strict';

    if (typeof define == 'function' && define.amd) {
        // AMD
        define([], function() {
            return factory(window);
        });
    } else if (typeof exports == 'object') {
        // CommonJS
        module.exports = factory(
            window
        );
    }

}(window, function factory (window) {
    'use strict';

    function parseVideoUrl (url) {
        var type = '';
        url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

        if (RegExp.$3.indexOf('youtu') > -1) {
            type = 'youtube';
        } else if (RegExp.$3.indexOf('vimeo') > -1) {
            type = 'vimeo';
        }

        return {
            type: type,
            id: RegExp.$6
        };
    }

    function makeVideoEmbed (vendor, id) {
        var videoEmbed = document.createElement('IFRAME');
        if (vendor === 'youtube') {
            videoEmbed.setAttribute('src', 'https://www.youtube.com/embed/' + id + '?enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=1&showinfo=0&controls=0&rel=0&showinfo=0');
        } else if (vendor === 'vimeo') {
            videoEmbed.setAttribute('src', 'https://player.vimeo.com/video/' + id + '?api=1&autoplay=true&title=0&byline=0&portrait=0');
        } else {
            return;
        }

        videoEmbed.setAttribute('webkitallowfullscreen', '');
        videoEmbed.setAttribute('mozallowfullscreen', '');
        videoEmbed.setAttribute('allowfullscreen', '');
        videoEmbed.setAttribute('frameborder', 0);

        return videoEmbed;
    }

    function setVideoState (videoEmbedElem, state) {
        var btn = document.querySelector('[aria-controls=' + videoEmbedElem.getAttribute('id') + ']');

        if (state === 'playing') {
            btn.setAttribute('aria-label', 'Pausa video');
            btn.classList.remove('video-paused');
            btn.classList.add('video-playing');

            videoEmbedElem.setAttribute('aria-hidden', false);
        } else if (state === 'paused' || state === 'stopped') {
            btn.setAttribute('aria-label', 'Spela video');
            btn.classList.remove('video-playing');
            btn.classList.add('video-paused');

            videoEmbedElem.setAttribute('aria-hidden', true);
        }
    }

    function postMessage (videoEmbedElem, action) {
        var iframe = videoEmbedElem.querySelector('iframe');
        var vendor = parseVideoUrl(iframe.getAttribute('src')).type;
        var message = vendor === 'vimeo' ? { method: (action === 'stop' ? 'unload' : action) } : { event: 'command', func: (action + 'Video'), args: '' };
        iframe.contentWindow.postMessage(JSON.stringify(message), '*');
    }


    // Constructor
    function videoEmbed (query, options) {
        if (!query) return false;

        // Element states
        var activeElems = [];

        var loadVideo = function (elem) {
            var video = parseVideoUrl(elem.getAttribute('data-video-src'));
            var videoEmbed = makeVideoEmbed(video.type, video.id);
            elem.appendChild(videoEmbed);
            elem.classList.add('embed-loaded');
        };

        var stopVideo = function (elem) {
            if (!elem.classList.contains('embed-loaded')) { return; }
            postMessage(elem, 'stop');
            setVideoState(elem, 'stopped');
        };

        var pauseVideo = function (elem) {
            if (!elem.classList.contains('embed-loaded')) { return; }
            postMessage(elem, 'pause');
            setVideoState(elem, 'paused');
        };

        var playVideo = function (elem) {
            // Append video embed to container – else just play the existing one
            if (!elem.classList.contains('embed-loaded')) {
                loadVideo(elem);
            } else {
                postMessage(elem, 'play');
            }

            setVideoState(elem, 'playing');
        };

        // Loop through a provided query
        var elems = (typeof query === 'string' ? document.querySelectorAll(query) : query);
        for (var i = 0, len = elems.length; i < len; i++) {
			var elem = elems[i];
            var toggleVideoBtn = document.querySelector('[aria-controls=' + elem.getAttribute('id') + ']');
            toggleVideoBtn.addEventListener('click', playVideo.bind(null, elem));

            // Export methods and elem references
            activeElems.push(elem);
		}

        // Expose methods and elem
        return {
            elems: activeElems,
            load: loadVideo,
            stop: stopVideo,
            pause: pauseVideo,
            play: playVideo
        };
    }

    // Expose to interface
	if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS, just export
		module.exports = videoEmbed;
	} else if (typeof define === 'function' && define.amd) {
		// AMD support
		define('videoEmbed', function ( ) { return videoEmbed; } );
	}
}));
