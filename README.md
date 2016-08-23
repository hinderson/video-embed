# Video Embed
Lazy load embedded video from YouTube or Vimeo when clicking on provided toggle button. Great for deferring multiple heavy video embeds on a website.

Also supports basic API methods and events like pause, play and stop.

## Example markup
```
<div id="video-embed" class="video-embed" data-video-src="https://www.youtube.com/watch?v=nleRCBhLr3k" style="background-image: url(video-poster.jpg);"></div>
<button aria-controls="video-embed">Play video</button>
```

**Required properties:** `data-video-src`, `aria-controls`

Enter the ID of the container/embed div as a value for the aria-controls property on the `<button>` element to trigger the correct video embed.

## Initiate
```
var VideoEmbed = require('video-embed');
var videoPlayer = new VideoEmbed('.video-embed'); // Can be a simple node, nodeList, or a query
```
