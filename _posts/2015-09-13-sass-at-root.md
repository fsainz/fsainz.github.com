---
layout: post
title: Sass @at-root
subtitle: Experimenting with the new @at-root selector, parent selectors and interpolation
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">September 13th, 2015 - Bonn</p>

Last week we've worked on defining the typography section for the style reference of our app, and I found a case that I couldn't solve with the sass ampersand selector, at least not the way I wanted too, until I read what you can do with `@at-root`.

We wanted to define our own _text emphasis variants_ (_text-primary_, _text-success_, ... etc.), similar to those from bootstrap, but without applying a darker color to links when hovering or focusing on them.

I took a look at boostrap's implementation:

<div class="row">
  <div class="col-md-6">
    {% highlight css %}
/* less */

.text-emphasis-variant(@color) {
  color: @color;
  a&:hover,
  a&:focus {
    color: darken(@color, 10%);
  }
}

.text-primary{
  .text-emphasis-variant(blue);
}
    {% endhighlight %}
  </div>
  <div class="col-md-6">
    {% highlight css %}
/* css */

.text-primary {
  color: blue;
}
a.text-primary:hover,
a.text-primary:focus {
  color: #0000cc;
}
    {% endhighlight %}
  </div>
</div>

I figured that the I could use sass '&' in the same way, after all, it lets you do things like these:

<div class="row">
  <div class="col-md-6">
    {% highlight scss %}
/* sass */

foo{
  &.bar{
    color: blue;
  }
  &bar{
    color:blue;
  }
  & bar{
    color:blue;
  }   
  bar &{
    color:blue;
  }
}
    {% endhighlight %}
  </div>
  <div class="col-md-6">
    {% highlight css %}
/* css */

foo.bar {
  color: blue;
}

foobar {
  color: blue;
}

foo bar {
  color: blue;
}

bar foo {
  color: blue;
}
    {% endhighlight %}
  </div>
</div>

Seems that something like `a.& {...}` would work nicely, unfortunately that's not valid syntax.

Next thing to try was interpolation, sometimes it does the trick, for example when dealing with variables in `calc`


<div class="row">
  <div class="col-md-6">
    {% highlight scss %}
/* sass */

$width: 20px;

#foo{
  width: calc(100% - $width);
}

#bar{
  width: calc(100% - #{$width});
}
    {% endhighlight %}
  </div>
  <div class="col-md-6">
    {% highlight css %}
/* css */

#foo {
  width: calc(100% - $width);
}

#bar {
  width: calc(100% - 20px);
}
    {% endhighlight %}
  </div>
</div>

In our case the result is still not the intended:

<div class="row">
  <div class="col-md-6">
    {% highlight scss %}
/* sass */

.text-primary{
  a#{&}{
    color: blue;
  }
}
    {% endhighlight %}
  </div>
  <div class="col-md-6">
    {% highlight css %}
/* css */

.text-success a.text-success {
  color: blue;
}
    {% endhighlight %}
  </div>
</div>


Here is when we can make us of the `@at-root` directive, which will jump out of
your current position to the top-level of the document

<div class="row">
  <div class="col-md-6">
    {% highlight scss %}
/* sass */
.text-primary{
  @at-root {
    a#{&} {
      color: blue;
    }
  }
}

    {% endhighlight %}
  </div>
  <div class="col-md-6">
    {% highlight css %}
/* css */
a.text-primary {
  color: blue;
}
    {% endhighlight %}
  </div>
</div>

This let us rewrite the less implementation of `.text-emphasis-variant` like this:

<div class="row">
  <div class="col-md-6">
    {% highlight scss %}
/* sass */
@mixin text-emphasis-variant($color) {
  color: $color;
  @at-root {
    a#{&}:hover, a#{&}:focus {
      color: $color;
    }
  }
}

.text-primary {
  @include text-emphasis-variant(blue);
}

    {% endhighlight %}
  </div>
  <div class="col-md-6">
    {% highlight css %}
/* css */
.text-primary {
  color: blue;
}
a.text-primary:hover, a.text-primary:focus {
  color: blue;
}

    {% endhighlight %}
  </div>
</div>

Now that Bootstrap 4 is moving from less to sass, I checked out how did they go around to solve it:


{% highlight scss %}

/* https://github.com/twbs/bootstrap/blob/v4-dev/scss/mixins/_text-emphasis.scss */

@mixin text-emphasis-variant($parent, $color) {
  #{$parent} {
    color: $color;
  }
  a#{$parent} {
    @include hover-focus {
      color: darken($color, 10%);
    }
  }
}

/* https://github.com/twbs/bootstrap/blob/v4-dev/scss/_utilities.scss */

@include text-emphasis-variant('.text-primary', $brand-primary);

{% endhighlight %}

It's a very nice solution, if you can reference the parent element directly, it might be even easier to read. If you want to jump out of more levels or use the mixin inside your class definition, then you have `@at-root` available.

Another case of use would be to apply it to keep related declarations together that belong to a single component. In this example from [ using sass 33s at root for piece of mind](http://www.alwaystwisted.com/articles/2014-03-08-using-sass-33s-at-root-for-piece-of-mind), we have a class with a given animation written out of it's context:


{% highlight scss %}
.avatar {
  background-color: red;
  height: 120px;
  margin: 40px;
  width: 120px;
  &:hover {
    animation: sizeme .8s infinite ease-in alternate;
  }
}
@keyframes fade {
  0% { transform: scale(1.0); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1.0); }
  75% { transform: scale(1.2); }
  100% { transform: scale(1.1); }
}
{% endhighlight %}

Instead, we can write it like this:

{% highlight scss %}
.avatar {
  background-color: red;
  height: 120px;
  margin: 40px;
  width: 120px;

  @at-root {
    @keyframes fade {
      0% { transform: scale(1.0); }
      25% { transform: scale(1.1); }
      50% { transform: scale(1.0); }
      75% { transform: scale(1.2); }
      100% { transform: scale(1.1); }
    }
  }
  &:hover {
    animation: fade .8s infinite ease-in alternate;
  }
}
{% endhighlight %}
