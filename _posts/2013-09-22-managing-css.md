---
layout: post
title: Managing CSS 1/3 - OOCS
comments: true
---

{{ page.title }}
================

<p class="meta">September 22nd, 2013 - Göttingen</p>

CSS tends to chaos easily. As a large set of rules that extend and override each other its tempting just to write a few lines more somewhere that fixes the problem at hand without following a pattern or taking care of their scope and avoiding repetition. 

With code we try to limit the reach and responsibility of every object, we write tests, avoid duplication and surprises like monkey-patching, we split long methods into meaningful chunks and explain and document what it's needed. With css it seems that we can toss a couple more declarations somewhere, and though it sort of works, this leads to huge files hard to maintain, and hours wasted writing the some code, fighting other rules, and fixing visual bugs which are really tricky to detect.

There are many ways to improve this. I like specially the ideas behind OOCSS - _Object Oriented CSS_, mainly that we should think in terms of modular components and reuse code through mixins and class composition more than class inheritance (so the result is predictable).

We shouldn't inherit styles and look like a dangerous clickable button because we are a link inside the last great-grand-child of someone <code>#projects .admin_panel ul li:last-child a</code> but because we look and behave like a clickable button <code>class="btn"</code> and we have a danger "skin" <code>class"btn btn-danger"</code>

Our selectors shouldn't go any deeper that the necessary to implement their concerns <code>.main-vertical-nav > .active > a</code>, and we should avoid to overspecify our declarations and the use of <code>!important</code>, with leads to a _specificity wars_ in which we desperately try to win over an almost identical rule written by us three months ago.

When you think about components rather than about the semantically meaningful pieces of your application you tend to identify reusable patterns more easily. For example if you have different kinds of headers instead of naming and targeting them like h1.post-title, .profiles_list h1, #account-settings .main_header h1.title .. etc, define three styles of headers (h1, h1.primary, h1.secondary) that look the same no matter where they are. A sign that this leads to reuse is that you could take this concept to another project and keep the names and declarations and just change their properties.

<a href="www.stubbornella.org/‎">Stubbornella</a> explains the advantages of thinking in components versus semantic classes and the core concepts of OOCSS in her talk __<a href="http://es.slideshare.net/stubbornella/our-best-practices-are-killing-us" target="_blank">Our Best Practices Are Killing Us</a>__ , and in this <a href="https://github.com/stubbornella/oocss/wiki">wiki</a> she talks about the two main concepts of OOCSS:


> __Separate structure and skin__
> 
> This means to define repeating visual features (like background and border styles) as  separate “skins” that you can mix-and-match with your various objects to achieve a large  amount of visual variety without much code.
> 
> Separating structure and skin can also mean using classes to name your objects and their > components, rather than relying solely on the semantics of HTML. For example, the media  object is named with `class="media"`, and its components are named with `class="img"` (for the image/video component) and `class="bd"` (for the body/text component).
> 
> By referencing these classes in your stylesheets (say, rather than directly styling the `<img>` element), your HTML can be flexible. For instance, if a new media element were to  take off in the next few years (e.g. `<svg>`), it could be integrated into the HTML without  having to touch the CSS.
> 
> __Separate container and content__
> 
> Essentially, this means “rarely use location-dependent styles”. An object should look the  same no matter where you put it. So instead of styling a specific `<h2>` with `.myObject h2 {...}`, create and apply a class that describes the `<h2>` in question, like `<h2 class="category">`.
> 
> This gives you the assurance that: (1) all unclassed `<h2>`s will look the same; (2) all elements with the category class (called a mixin) will look the same; and 3) you won’t need to create an override style for the case when you actually do want `.myObject h2` to look like the normal `<h2>`.


<iframe src="http://www.slideshare.net/slideshow/embed_code/7451831" width="580" height="480" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen webkitallowfullscreen mozallowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="https://es.slideshare.net/stubbornella/our-best-practices-are-killing-us" title="Our Best Practices Are Killing Us" target="_blank">Our Best Practices Are Killing Us</a> </strong> from <strong><a href="http://www.slideshare.net/stubbornella" target="_blank">Nicole Sullivan</a></strong> </div>


