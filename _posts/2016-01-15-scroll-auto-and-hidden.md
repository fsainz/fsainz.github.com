---
layout: post
title: Overflow hidden or auto with visible
subtitle: Invalid combinations of overflow-x and overflow-y in css
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">January 15th, 2016 - Bonn</p>

We were trying to make a container overflow in the x axis and not in the y axis, without adding scrollbars. Turns out you can't do it with `overflow-x`/`overflow-y` properties.

According to the W3C spec:

> The computed values of ‘overflow-x’ and ‘overflow-y’ are the same as their specified values, except that some combinations with ‘visible’ are not possible: if one is specified as ‘visible’ and the other is ‘scroll’ or ‘auto’, then ‘visible’ is set to ‘auto’.

This explains that something like

{% highlight scss %}
overflow-x: visible;
overflow-y: scroll;
{% endhighlight %}

turns into

{% highlight scss %}
overflow-x: auto;
overflow-y: auto;
{% endhighlight %}

However that's not our case. In [http://www.brunildo.org/test/Overflowxy2.html](http://www.brunildo.org/test/Overflowxy2.html) there are some tests, seems that in Safari, Opera, and in our test also chrome, `visible` becomes `auto` also when combined with `hidden`. Also in IE7, IE8 `visible` becomes `hidden` when combined with `hidden`.

In general, when we use `visible` for one axis, the other one turns into `auto`.


Example:

<p data-height="268" data-theme-id="0" data-slug-hash="obeaqJ" data-default-tab="result" data-user="fsainz" class="codepen">See the Pen <a href="http://codepen.io/fsainz/pen/obeaqJ/">obeaqJ</a> by Fernando Sainz (<a href="http://codepen.io/fsainz">@fsainz</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
