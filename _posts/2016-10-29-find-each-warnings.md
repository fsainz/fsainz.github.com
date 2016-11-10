---
layout: post
title: find_each warnings
heading-class: "post-heading-only-image-compact"
---

{{ page.title }}
================

<p class="meta">October 29th, 2016 - Bonn</p>

Although usign `find_each`, `find_in_batches` to iterate through large collections
seems like a very good idea, there is a gotcha with scopes carrying limit or
order information: due to the implementation, they are (or _were_, up until the latest active_record versions) silently ignored.

I was playing with the idea of patching these methods to add an exception when an
order was going to be ignored, turns out that there is already a few things in
place, and more to come.

With rails `4.2.6`, the logger already warns when order or limit are present:

<a href="https://github.com/rails/rails/blob/2a7cf24cb7aab28f483a6772b608e2868a9030ba/activerecord/lib/active_record/relation/batches.rb#L113">ActiveRecord::Batches (4.2.6)</a>

{% highlight ruby %}
def find_in_batches(options = {})
  # ...
  if logger && (arel.orders.present? || arel.taken.present?)
    logger.warn("Scoped order and limit are ignored, it's forced to be batch order and batch size")
  end
  # ...
{% endhighlight %}

In rails `5.0.0.1`, there is an option to throw an excepcion instead of logging a warning that we
can configure at the application level:

<a href="http://api.rubyonrails.org/v5.0.0.1/classes/ActiveRecord/Batches.html#method-i-find_in_batches">http://api.rubyonrails.org/v5.0.0.1/classes/ActiveRecord/Batches.html#method-i-find_in_batches</a>

<blockquote>
:error_on_ignore - Overrides the application config to specify if an error should be raised when the order and limit have to be ignored due to batching.
</blockquote>

<a href="https://github.com/rails/rails/blob/ac027338e4a165273607dccee49a3d38bc836794/activerecord/lib/active_record/relation/batches.rb#L234">ActiveRecord::Batches (5.0.1)</a>

{% highlight ruby %}
# ActiveRecord::Base.error_on_ignored_order_or_limit = true

def act_on_order_or_limit_ignored(error_on_ignore)
  raise_error = (error_on_ignore.nil? ? self.klass.error_on_ignored_order_or_limit : error_on_ignore)

  if raise_error
    raise ArgumentError.new(ORDER_OR_LIMIT_IGNORED_MESSAGE)
  elsif logger
    logger.warn(ORDER_OR_LIMIT_IGNORED_MESSAGE)
  end
end
{% endhighlight %}


In the next release of rails we'll get support for `limit`, whereas `order` will
leave a warning or raise an exception depending on our settings on `ActiveRecord::Base.error_on_ignored_order`

<a href="https://github.com/rails/rails/commit/451437c6f57e66cc7586ec966e530493927098c7">https://github.com/rails/rails/commit/451437c6f57e66cc7586ec966e530493927098c7</a>

<blockquote>
The flag error_on_ignored_order_or_limit has been deprecated in favor of the current error_on_ignored_order.
<br/><br/>
Xavier Noria
<br/><br/>
Batch processing methods support limit:
<br/><br/>
Post.limit(10_000).find_each do |post|
  # ...
end
<br/><br/>
It also works in find_in_batches and in_batches
</blockquote>

With a rails < 5 app, we can add a patch to add the raise on ignore option manually, like here:

{% highlight ruby %}
# initializers/raise_on_ignored_limit_or_order.rb
raise 'Can not patch this version of ActiveRecord' unless ActiveRecord::VERSION::STRING == '4.2.6'

module ActiveRecord
  module Batches
    # source:  https://github.com/rails/rails/blob/v4.2.6/activerecord/lib/active_record/relation/batches.rb#L98
    # User.limit(1).find_each...
    # ArgumentError: Limit is not supported with find_each
    #
    # remove the limit first: User.limit(1).limit(nil).find_each do ...
    #
    def find_in_batches(options = {})
      raise ArgumentError.new('Limit is not supported with find_each') if arel.taken
      raise ArgumentError.new('Order is not supported with find_each') if arel.orders.present?

      options.assert_valid_keys(:start, :batch_size)

      relation = self
      start = options[:start]
      batch_size = options[:batch_size] || 1000

      unless block_given?
        return to_enum(:find_in_batches, options) do
          total = start ? where(table[primary_key].gteq(start)).size : size
          (total - 1).div(batch_size) + 1
        end
      end

      # if logger && (arel.orders.present? || arel.taken.present?)
      #  logger.warn("Scoped order and limit are ignored, it's forced to be batch order and batch size")
      # end

      relation = relation.reorder(batch_order).limit(batch_size)
      records = start ? relation.where(table[primary_key].gteq(start)).to_a : relation.to_a

      while records.any?
        records_size = records.size
        primary_key_offset = records.last.id
        raise "Primary key not included in the custom select clause" unless primary_key_offset

        yield records

        break if records_size < batch_size

        records = relation.where(table[primary_key].gt(primary_key_offset)).to_a
      end
    end
  end
end
{% endhighlight %}






