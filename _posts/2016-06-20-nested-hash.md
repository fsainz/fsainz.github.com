---
layout: post
title: Infinite nested hash
heading-class: "post-heading-only-image-compact"
subtitle: "Write full key paths at once, like hash[:a][:b][:c] = 1"
---

{{ page.title }}
================

<p class="meta">June 20th, 2016 - Bonn</p>


Sometimes you want to add a value to a hash in a certain level of a nested structure that might or might not have been initialized before.

{% highlight ruby %}
data = {}
# ...
data[:foo][:bar][:baz] = 123
# -> NoMethodError: undefined method `[]' for nil:NilClass

{% endhighlight %}

You could verify first if every level of the chain exists (`data[:foo] ||= {}`, etc.), but it would be interesting to have a way of inserting the whole path to that key at once, like when we create a directory using `mkdir -p a/b/c`.

`Hash` let us set a default value in case the key was not already present:

{% highlight ruby %}
h = Hash.new(1)
h[:a]
# -> 1

# you can also set it explicitely
h.default = 2
h[:a]
# -> 2
{% endhighlight %}

The first idea would be to take advantage of that default to initialize the missing key with an empty hash

{% highlight ruby %}
h = Hash.new({})
h[:a][:b]=1
# works
# -> 1

h[:c][:d][:e]
# -> NoMethodError: undefined method `[]' for nil:NilClass

{% endhighlight %}

Ideally, the hash coming from this default would also have the same behaviour:

{% highlight ruby %}
h = Hash.new( Hash.new({}) )
h[:a][:b][:c]=1
# -> 1

h[:c][:d][:e][:f]
# -> NoMethodError: undefined method `[]' for nil:NilClass
{% endhighlight %}

We need some recursion in which the default value is created with the same code that originated the first hash. For that we can make use of another way of setting a default by passing a `Proc`:


{% highlight ruby %}
h = Hash.new{|hash, key| hash[key]= 1}
h[:a]
# -> 1

# this proc doesn't have anything especial
h = Hash.new{|h,k| puts "what would happen"}
h[:a]
# => what would happen
# => nil

# we can access and change this proc using `default_proc`
silly_proc = h.default_proc
silly_proc.call
# => what would happen
# => nil
{% endhighlight %}

We can use this `default_proc` to implement the recursion we need:


{% highlight ruby %}
h = Hash.new { |hash, key| hash[key] = Hash.new{|_hash, _key| hash.default_proc.call(_hash, _key) }}
h[:a][:b][:c][:d]=1
# => 1
{% endhighlight %}

But this is a bit ugly. We have a nicer syntax to convert a `Proc` into a `block`:

{% highlight ruby %}
foo = Proc.new{|n| n*n}
[1,2].map(&foo)
# => [1, 4]
{% endhighlight %}

Usign that we can reduce it to:

{% highlight ruby %}
h = Hash.new { |hash, key| hash[key] = Hash.new(&hash.default_proc) }
{% endhighlight %}

