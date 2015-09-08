---
layout: post
title: Managing CSS 4/4 - Box of Tricks
heading-class: "post-heading-only-image-compact"
---

{{ page.title }}
================

<p class="meta">December 23rd, 2013 - Bayern</p>

I've been coding css for years and I couldn't explain properly what I've been learning. It's not that I could just start writing on any other topic like if I've had a well structured index on my mind to follow, but layouts with css feels specially messy. You learn how to find your way around problems rather than memorizing the specific cross-browser solutions, because that would be like learning by heart the list of bugs solved by a project during years.

You can spend hours of trial and error till you find the right combination of markup and rules for a list of browsers, and the pros, cons and inconsistent behaviors of all those iterations are somehow lost, you remember which were the parameters to play with and watch out for(negative margins, overflow, position relative, an inner wrapper with max-width:100% ...) but you are likely to repeat that trial and error the next time that you find yourself on a similar situation. And this a language in which a technique to get a 2 columns layout working deserves the name of holy grail...

Hopefully <a href="http://philipwalton.github.io/solved-by-flexbox/">flexbox</a> will make most of these problems a thing of the past, but in the meantime I'd like to start creating a small personal library of common patterns that work good enough, and that are easy to modify in order to expose the different issues across browsers.

I started with these three:


<p data-height="394" data-theme-id="0" data-slug-hash="rEgzq" data-user="fsainz" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/fsainz/pen/rEgzq'>Issue with negative margins </a> by Fernando Sainz (<a href='http://codepen.io/fsainz'>@fsainz</a>) on <a href='http://codepen.io'>CodePen</a></p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

<br />
<br />

<p data-height="394" data-theme-id="0" data-slug-hash="tEgrK" data-user="fsainz" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/fsainz/pen/tEgrK'>Media Wrappers</a> by Fernando Sainz (<a href='http://codepen.io/fsainz'>@fsainz</a>) on <a href='http://codepen.io'>CodePen</a></p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

<br />
<br />

<p data-height="394" data-theme-id="0" data-slug-hash="IwcGE" data-user="fsainz" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/fsainz/pen/IwcGE'>Floated Media + one line fields (with ellipsis)</a> by Fernando Sainz (<a href='http://codepen.io/fsainz'>@fsainz</a>) on <a href='http://codepen.io'>CodePen</a></p>
<script async src="//codepen.io/assets/embed/ei.js"></script>

---
<br />
<br />

I read a comment on HN about <em>sysvinit</em> which I think is a great (and sad) reply to those who think that css is pretty good as it is today:

<blockquote>
  <em>css works only if you combine incredibly low expectations with a bad case of Stockholm syndrome.</em>
</blockquote>
