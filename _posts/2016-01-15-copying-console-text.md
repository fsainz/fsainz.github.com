---
layout: post
title: Copying a long output from the console
subtitle: multipage
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">January 15th, 2016 - Bonn</p>

Let's say that you want to copy paste the list of countries in ISO3166 format from a gem, you get an output like this in the console, where you can only see the first elements

<img src="/img/long-output-1.png" />

I've found myself copying chunks on the output manually, one trick in some cases is just to make the console font smaller

<img src="/img/long-output-2.png" />

You could also create a more compact string joining the array with some character and then unpack it on a editor replacing those characters. Sometimes this trick also helps, to copy the contents to the clipboard, although some format is lost.

{% highlight ruby %}
`echo #{ISO3166::Country.all} | pbcopy`
{% endhighlight %}
