---
layout: post
title: Each with progress bar and benchmark
subtitle: Add time measurement and progress estimation to your enumerables
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">January 15th, 2016 - Bonn</p>


Time to time we have to run operations on the console just for developing purposes that are applied to a set of elements and which take minutes or more to finish. To have an idea of how long these operations take and when they will be over, we added the `tqdm` gem [https://github.com/powerpak/tqdm-ruby](https://github.com/powerpak/tqdm-ruby)

Now we can call `.tqdm` on enumerables to get something like this (example from their repo):

<img src="/img/tqdm.gif" />

You could do an expensive operation on every user like this

{% highlight ruby %}
User.all.tqdm.each do |user|
  #(...)
end
{% endhighlight %}

If that operation involves more queries, you might want to turn off logging

{% highlight ruby %}
ActiveRecord::Base.logger.silence do
  User.all.tqdm.each do |user|
    #(...)
  end
end
{% endhighlight %}


We also benchmark often these operations

{% highlight ruby %}
Benchmark.measure do
  ActiveRecord::Base.logger.silence do
    # ...
  end
end
{% endhighlight %}


If you do this quite often you might want to extend `Enumerable` like this:

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
