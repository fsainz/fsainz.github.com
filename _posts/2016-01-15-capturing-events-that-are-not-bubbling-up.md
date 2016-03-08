---
layout: post
title: Capturing events in javascript that are not bubbling up
subtitle: How to listen to an event on a DOM element whose propagation has been stopped
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">January 15th, 2016 - Bonn</p>

I wanted to listen to an event that whose propagation was being stopped before reaching my parent element. To do that I can pass a third parameter _useCapture_ to the `addEventListener`

{% highlight coffee %}
eventTarget.addEventListener(type, listener, useCapture=false)
{% endhighlight %}

It seems that this third parameter exists for historical reasons, since Netscape wanted a model in which events went down the tree (from parent elements to the target, this is *event capturing*), and Microsoft wanted it to go up the tree (from target to parents, this is the usual *event bubbling*). In modern browsers, this parameter defaults to false, and Microsoft didn't support it (= not supporting _capturing_) until IE9.

Example:

<p data-height="268" data-theme-id="0" data-slug-hash="WrEPEr" data-default-tab="js" data-user="fsainz" class="codepen">See the Pen <a href="http://codepen.io/fsainz/pen/WrEPEr/">Example of event capturing</a> by Fernando Sainz (<a href="http://codepen.io/fsainz">@fsainz</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>


Links:

- [https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

- [https://www.w3.org/TR/DOM-Level-3-Events/#event-flow](https://www.w3.org/TR/DOM-Level-3-Events/#event-flow)

- [http://stackoverflow.com/questions/17564323/what-does-the-third-parameter-false-indicate-in-document-addeventlistenerdev](http://stackoverflow.com/questions/17564323/what-does-the-third-parameter-false-indicate-in-document-addeventlistenerdev)
