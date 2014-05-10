---
layout: post
title: Faux Cropping with CSS, Jquery and Rails Helpers
comments: true
---

{{ page.title }}
================

<p class="meta">May 10th, 2014 - Göttingen</p>

<img src="/images/crop_example.jpg">

We've been using a CSS technique to resize and position an image inside a container as if it had been cropped. The goal was to provide an image to the user as quickly as possible, before the background image processors finished, and this let us make use of the original image for a couple of seconds.

We are changing to another aproach, and as a way to remember this technique and play a little with gems & plugins, I extracted it to a Jquery Plugin (<a href="/jquery_faux_crop.html">Jquery Faux Crop</a>) and a Rails gem (<a href="/rails_helper_faux_crop.html">Rails Helper Faux Crop</a>).