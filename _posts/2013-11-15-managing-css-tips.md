---
layout: post
title: Managing CSS 3/4 - Tools & Tips
heading-class: "post-heading-only-image-compact"
---

{{ page.title }}
================

<p class="meta">November 15th, 2013 - Göttingen</p>

Avoid using the controller name & action as cope
================================================
That should be a last resource solution. You start adding controller names and (worse) the list of actions to apply to those styles to when different actions belong to different layouts. Besides, from a css point of view, it's easier to understand what goes with .user_dashboard
than #home_controller.index

In our rails app, we use <strong>nested layouts</strong> to have as many layouts as the design requires


{% highlight haml %}
# view/layouts/base.html.haml
body{:class=>controller.send(:_layout)}

# view/layouts/dashboard.html.haml
= render template:"layouts/base"
{% endhighlight %}




Use Compass or learn from it
============================
Compass is a very well documented library of SASS mixings. Among other things, it's lets your define which level of legacy support you want before applying the convenient hacks and vendor prefixes. Even if you don't intend to use it, take a look at the source code to get ideas for your own mixins. A lighweight alternative is <a href="http://bourbon.io/">Bourbon</a>.
 

Modernizer
==========
As state on the page, "Modernizr is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.". Instead of checking <a href="http://caniuse.com/">can i use</a> and relying on conditional stylesheets and printing the broswer type and version into a class inside the dom, this library will tell you is the feature is supported (which makes sense, since broswer versions are losing their significance, except of course for...).

To keep it as small as possible, you can <a href="http://modernizr.com/download/">download</a> a compiled version with only the "checks" that you want to perform. For example, pick _background-size_ to check if there is support for <code>background-size: cover</code>, and load a polyfill for this kind of backgrounds if <code>Modernizr.backgroundsize</code> is false.


CSS properties order
====================
It's a good practice to start with those properties affecting the layouts (position, width, padding, float...) and leave the _harmless_ at the end (color, background, border-radius..). After dealing with stunning IE quirks your paranoia gets to a point in which you start considering every property as a potential offender (good, keep on doing that), but there are rules worse than others. Opacity is absolutely harmless, isn't it? except if you use a filter for old IE's and <a href="http://philipwalton.com/articles/what-no-one-told-you-about-z-index"> it changes the z-index stack order</a>

Another practice that we follow is to _go with the flow_, unless there is a good reason the rules add <code>margin-bottom</code> and <code>margin-right</code> (or left if the float to the right), but not up or right because that has lead in the past to elements fighting to get closer using negative margins.


Use the Chrome Developer Tools
==============================
Absurdly useful. If I couldn't use it anymore (or Firebug/Safari dev tools), I'll quit and go find another occupation. Recently they started allowing you to tweak the html/css while debugging javascript, which let's you do the neat trick of hovering over an element with your mouse and stopping the js execution calling debugger from the console (it's useful when your js makes you interface pop and fly away when you just want your DOM to stay still)


IE Splitter
===========
Your IE has started to utterly ignore your declarations?  After clearing the cache for a thousandth time, may be you have reached the IE(<10) limit of 4095 selectors for file, in which case you should get a css splitter to divide that file in two (for rails we use <a href="https://github.com/zweilove/css_splitter">zweilove/css_splitter</a>)
