---
layout: post
title: Issues with Active Model Serializers
heading-class: "post-heading-only-image-compact"
---

{{ page.title }}
================

<p class="meta">May 21st, 2015 - Bonn</p>

The <a href="https://github.com/rails-api/active_model_serializers">ActiveModel::Serializer</a> gives you a nice DSL to handle attributes and relationships when serializing objects.

I had some issues when trying to embed those relationships, in some cases I would just get a hash with the object attributes (probably the same as calling <code>to_json</code> directly) instead of going through the serializer of the associated model.

I found related open issues:

<em>each_serializer options seems not to work (...) insead of specified serializer, it just returns serialised object.</em>
<a href="https://github.com/rails-api/active_model_serializers/issues/664">https://github.com/rails-api/active_model_serializers/issues/664</a>

<em>No Matter What I do I only get a normal object hash</em>
<a href="https://github.com/rails-api/active_model_serializers/issues/706">https://github.com/rails-api/active_model_serializers/issues/706</a>

I tried many things without success, at the end I got this pattern working at least for the version 0.10.0.pre. It's ugly but it can be easily replaced in the future when this is no longer an issue

instead of a *has_many* :attachments, I would add this method:

{% highlight ruby %}
def attachments
  attachments = object.attachments.to_a
  return [] if attachments.empty?
  serializer = ActiveModel::Serializer::ArraySerializer.new(attachments, each_serializer:AttachmentSerializer)
  ActiveModel::Serializer::Adapter::JsonApi.new(serializer).as_json[:attachments]
end
{% endhighlight %}

for a *belongs_to* :category, I would do

{% highlight ruby %}
def category
  if object.category
    serializer = CategorySerializer.new(object.category)
    ActiveModel::Serializer::Adapter::JsonApi.new(serializer).as_json[:categories]
  end
end
{% endhighlight %}
