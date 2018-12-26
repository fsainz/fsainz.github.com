---
layout: post
title: epic hash cleaner
heading-class: "post-heading-only-image-compact"
---

{{ page.title }}
================

<p class="meta">June 17th, 2018 - Bonn</p>

I made a small gem to remove nil and empty elements from a hash recursively:  <a href="https://github.com/i22-digitalagentur/epic-hash-cleaner">https://github.com/i22-digitalagentur/epic-hash-cleaner</a>.

`hash_cleaner` and `hashcleaner` were already taken :)

{% highlight ruby %}
 # Examples

EpicHashCleaner.clean { a: nil, b: '', c: [], d: {} }
# => {}

EpicHashCleaner.clean { a: false, b: ' ' }
# => { a: false, b: ' ' }

EpicHashCleaner.clean { a: [nil], b: [nil, '', [{}], { a: [''] }] }
# => {}

EpicHashCleaner.clean { a: { b: { c: [{ d: ['', 1], e: nil }] } } }
# => { a: { b: { c: [{ d: [1] }] } } }

EpicHashCleaner.clean nil
# => {}
{% endhighlight %}
