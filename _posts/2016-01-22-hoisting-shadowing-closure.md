---
layout: post
title: Hoisting, Shadowing, Closures
subtitle: Notes about some mysterious sounding terms in Javascript.
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">January 15th, 2016 - Bonn</p>

Notes about some mysterious sounding terms in Javascript.

## Hoisting

<img src="/img/hoisting.jpg" />

This refers to how Javascript internally moves all declarations to the top of the current scope (imagine a crane _hoisting_ = _lifting_ them up to the top). That scope could be the whole script or the function they are in, blocks like `if/for` don't define their own scope.

So

{% highlight javascript %}
function foo() {
  bar();
  var x = 1;
}
{% endhighlight %}

is actually

{% highlight javascript %}
function foo() {
  var x;
  bar();
  x = 1;
}
{% endhighlight %}

but

{% highlight javascript %}
if (...) {
  bar();
  var x = 1;
}
{% endhighlight %}

is

{% highlight javascript %}
var x;
if (...) {
  bar();
  x = 1;
}
{% endhighlight %}

this has unexpected consequences, for example:
{% highlight javascript %}
var foo = 1;
function bar() {
  if (!foo) {
    var foo = 2;
  }
  console.log(foo);
}
bar();
{% endhighlight %}

here this will log `2` since it's interpreted as:
{% highlight javascript %}
var foo = 1;
function bar() {
  var foo; // foo is a new undefined variable
  if (!foo) {
    foo = 2;
  }
  console.log(foo);
}
bar();
{% endhighlight %}

There are some rules that makes this trickier. First, a *function declaration* (`function foo(){...}`) takes priority over a *variable declaration* (`var foo = 1`).

In this case:
{% highlight javascript %}
var foo = 1;
function foo(){};
console.log(foo);
{% endhighlight %}

this will log `1`. It is like if it was written like:

{% highlight javascript %}
var foo = function(){};
foo = 1;
console.log(foo);
{% endhighlight %}

Here:
{% highlight javascript %}
var foo = 1;
function bar() {
  foo = 2;
  return;
  function foo() {}
}
bar();
console.log(foo);
{% endhighlight %}

this will log `1`, since this is like if we had
{% highlight javascript %}
var foo = 1;
function bar() {
  var foo = function(){};
  foo = 2;
  return;
}
bar();
console.log(foo);
{% endhighlight %}

so the line `foo=2` is not changing the variable in the parent scope but its new independent `foo`

Other interesting thing is that with a function declaration everything get's lifted to the top, the name and the body of the function, instead of just the name. This is for the function declarations (`function foo() { ... }`), not the function expressions (`var foo = function foo() { .... }`), that behave like the others.

Here i get lost with the terminology some times:
{% highlight javascript %}
// variable declaration
var foo = 1;

// Function declaration
function foo() { return 1; }

// Anonymous function expression
var foo = function() { return 1; }

// Named function expression
var foo = function foo() { return 1; }
{% endhighlight %}

So
{% highlight javascript %}
foo();
function foo(){ return 1}
{% endhighlight %}

returns 1, but

{% highlight javascript %}
foo();
var foo = function foo(){ return 1};
{% endhighlight %}

fails



<hr />

## Shadowing
<img src="/img/shadowing.jpg" />

Imagine that you had a variable, and you wanted to use another with the same name inside a method, in that case you would _shadow_ the outer variable like this:
{% highlight javascript %}
var foo = 1;

function(){
  var foo = 2; // this variable is independent
}
{% endhighlight %}

This works with functions, not with within an `if` for example. In coffeescript you have to be keep in mind that you might be altering another variable in the same script since you can't shadow them using `var`, but there are other options:

1) If you can use ECMAScript 6, you have the option to use a block scope with `let`:

{% highlight javascript %}
var foo = 1;

if (...){
  let foo = 2; // this variable is also independent
}
{% endhighlight %}

2) Use a **Immediately-Invoked Function Expression (IIFE)** = _self-executing anonymous function_ (or _self-invoked anonymous function_)
`(function() { ... })();`

{% highlight javascript %}
var foo = 1;
if (...){
  (function(){
    var foo = 2; // this variable is also independent
  }()
}
{% endhighlight %}


<hr />

## Closure
<img src="/img/closure.jpg" />

This is the fact that a function that is defined inside another, will keep access to all the variables of this parent function, even after this parent function exits.

Let's say that you have something like
{% highlight javascript %}
function makeCounter() {
  var i = 0;

  function tellMeTheValue() {
    alert(i);
  }

  setTimeout(tellMeTheValue, 10000);  

  return function increaseByOne() {
    console.log( ++i );
  };
}

counter = makeCounter();
counter(); // logs: 1
counter(); // logs: 2
// 10 seconds after making the counter we get an alert with the latest value
{% endhighlight %}
--

Related: This is bug that we had, in which were executing a series of functions with a setTimeout without realizing that the reference to the function was being replaced (instead of creating a closure to preserve them)
{% highlight javascript %}
events = {
  foo: function() {
    return console.log("foo");
  },
  bar: function() {
    return console.log("bar");
  }
};

applyEvents = function() {
  var eventHandler, eventName, results;
  for (eventName in events) {
    eventHandler = events[eventName];
    setTimeout(function() {
      eventHandler();
    });
  }
};

applyEvents2 = function() {
  var eventHandler, eventName, results;
  for (eventName in events) {
    eventHandler = events[eventName];
    (function(_eventHandler) {
      return setTimeout(function() {
        _eventHandler();
      });
    })(eventHandler)
  }
};
{% endhighlight %}

<p data-height="268" data-theme-id="0" data-slug-hash="yYrQxR" data-default-tab="js" data-user="fsainz" class="codepen">See the Pen <a href="http://codepen.io/fsainz/pen/yYrQxR/">javascript issue</a> by Fernando Sainz (<a href="http://codepen.io/fsainz">@fsainz</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>


---

Links:

- [http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html](http://www.sitepoint.com/demystifying-javascript-variable-scope-hoisting/)
- [https://github.com/joeytwiddle/coffeescript-gotchas](http://www.sitepoint.com/demystifying-javascript-variable-scope-hoisting/)
- [http://www.sitepoint.com/demystifying-javascript-variable-scope-hoisting/](http://www.sitepoint.com/demystifying-javascript-variable-scope-hoisting/)
