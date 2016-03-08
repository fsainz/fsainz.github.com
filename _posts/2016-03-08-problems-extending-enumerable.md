---
layout: post
title: Problems extending Enumerable
subtitle: Attempts to monkey patch Enumerable in a cleaner way
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">March 8th, 2016 - Bonn</p>

I wrote how to add a simple method to `Enumerable` in a [previous post]({% post_url 2016-01-21-progress-bar-and-benchmark %})

{% highlight ruby %}
module Enumerable
  def measure(&block)
    Benchmark.measure do
      ActiveRecord::Base.logger.silence do
        self.tqdm.each(&block)
      end
    end
  end
end
{% endhighlight %}

I wanted to follow the points in this article [3 Ways to Monkey-patch Without Making a Mess](http://www.justinweiss.com/articles/3-ways-to-monkey-patch-without-making-a-mess/), but there seems to be some cases in which this technique can't be applied, at least the part regarding putting your method in a module.

In order to make other developers aware of this monkey patches, we start by requiring it inside an initializer in `config/initializers/monkey_patches.rb`

{% highlight ruby %}
require 'core_extensions/enumerable/progress_benchmark'
{% endhighlight %}

then I add a file at `lib/core_extensions/enumerable/progress_benchmark` following rails conventions

{% highlight ruby %}
module CoreExtensions
  module Enumerable
    module ProgressBenchmark

      def measure(&block)
        Benchmark.measure do
          ActiveRecord::Base.logger.silence do
            self.tqdm.each(&block)
          end
        end
      end  

    end
  end
end

Enumerable.include CoreExtensions::Enumerable::ProgressBenchmark
{% endhighlight %}

if we try it now in the console:

{% highlight ruby %}
[].measure
#NoMethodError: undefined method `method' for []:Array
{% endhighlight %}

it would exist if we include `Enumerable` now:
{% highlight ruby %}
class Foo
  include Enumerable
end

Foo.new.measure
#NoMethodError: super: no superclass method `each'  (it's ok, it has been included )
{% endhighlight %}

Seems that including methods this way doesn't work when you refer to classes that have already included that module. These posts speak about a limitation on the current ruby implementation:

- [Reopening a module vs. Module.include](https://www.ruby-forum.com/topic/78653)
- [include is not working when re-opening the module](https://www.ruby-forum.com/topic/4465503)

This however works well just reopening the module, as originally.

Active Support [reopens as well](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/core_ext/hash/except.rb)

A workaround would be do something like this, to iterate through the object space, find all the classes that had previously included `Enumerable` and include it again:

{% highlight ruby %}
ObjectSpace.each_object(Class) do |klass|
  if klass.include?(Enumerable )
    klass.include CoreExtensions::Enumerable::ProgressBenchmark)
  end
end
{% endhighlight %}

Not sure whether this is a good idea yet.
