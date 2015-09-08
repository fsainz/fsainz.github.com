---
layout: post
heading-class: "post-heading-only-image-compact"
title: Search code and set email hooks in Github
---

{{ page.title }}
================

<p class="meta">August 2nd, 2012 - Madrid</p>

Two useful tricks that I didn't know I could do: The first if that you
can search code for a repo that doesn't belong to you (oddly enough, github features a
nice <em>search code</em> box when you browse your own repositories but not
for the others (not even for the ones you forked)).

It's not a secret
feature but it did go unnoticed for me until recently, in <a href="https://github.com/search">advanced search</a> you can select to search for code and specify the search string and repo that interests you, for example. I wannted to <a href="https://github.com/search?q=%2Ftmp%2Fvagrant-network-interfaces+repo%3Amitchellh%2Fvagrant&repo=&langOverride=&start_value=1&type=Code&language="> search "/tmp/vagrant-network-interfaces" in the mitchellh/vagrant repo
</a>

<code>
/tmp/vagrant-network-interfaces repo:mitchellh/vagrant
</code>


<img src="/img/github-search.png" />

<br />
The other useful _trick_ is to set a email service hook in your
repository's admin settings to get an email everything someone pushes to
a branch (click on the *email* service hook, setup the email address and
as silly as it sounds, don't forget to click on "active" ;)
