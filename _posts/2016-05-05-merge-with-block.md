---
layout: post
title: Merge with block
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">May 5th, 2016 - Bonn</p>

Ruby has these nice moments when you think _i like this method but i need to change how it operates_ and it turns out that that method is already prepared to receive a block to do what you had in mind.

I had a series of prices coming from a source in the following format:

```{"5" => 200, "6" => 600, ...}```, where the key would be the ID of the object and the value the price.

I had multiple series like those, and I had to produce a hash with the averages for every object according to their occurences. Something like this:

{% highlight ruby %}
  old_hash = { "5" => 200, "6" => 300}
  new_hash = { "5" => 400, "7" => 100}

  old_hash.super_merge(new_hash)
  # => {"5"=>300.0, "6"=>300, "7"=>100}
{% endhighlight %}

Turns out that `.merge` accepts a block in which you can control how the combination is performed:

{% highlight ruby %}
  old_hash = { "5" => 200, "6" => 300}
  new_hash = { "5" => 400, "7" => 100}
  old_hash.merge(new_hash){|key, v1, v2| (v1 + v2)/2.0}
  # => {"5"=>300.0, "6"=>300, "7"=>100}
{% endhighlight %}

This is pretty neat. I wanted to see how would I do it on my own and give another go to refinements:


{% highlight ruby %}
module HashSuperMerge
  refine Hash do
    def super_merge(other_hash, &block)
      new_hash = self.dup
      other_hash.each do |key, value|
        new_hash[key] = if self.has_key?(key) && block_given?
          block.call(key, self[key], other_hash[key])
        else
          value
        end
      end
      new_hash
    end
  end
end

# test
require "test/unit"

class TestSimpleNumber < Test::Unit::TestCase
  using HashSuperMerge

  def setup
    @old_hash = { "5" => 200, "6" => 300 }
    @new_hash = { "5" => 400, "7" => 100 }
  end

  def test_without_block
    merged_hash = @old_hash.super_merge(@new_hash)
    assert_equal  400, merged_hash["5"]
    assert_equal  300, merged_hash["6"]
    assert_equal  100, merged_hash["7"]
  end
  def test_with_block
    merged_hash = @old_hash.super_merge(@new_hash){|key, v1, v2| v1 + v2}
    assert_equal  600, merged_hash["5"]
    assert_equal  300, merged_hash["6"]
    assert_equal  100, merged_hash["7"]
  end
end
{% endhighlight %}

Alternatively, you can extend each instance of the hash, removing the `refine Hash` block of the module definition and doing a `old_hash.extend(HashSuperMerge)` on every iteration.
