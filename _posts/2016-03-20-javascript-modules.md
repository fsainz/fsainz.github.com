---
layout: post
title: Javascript modules
subtitle: Patterns, CommonJS, AMD, Globals, UMD, ES6 Modules
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">March 20th, 2016 - Bonn</p>

I've been using javascript modules of different kinds without understanding the terminology and approaches, I wanted to make some notes about it:

We've using some sort of modules before with Coffeescript/Angular in Rails projects. Often  we just had an object `App` defined on the global scope, to which we attached the given module:

{% highlight coffee %}

  # setup.js

  window.App = {}

  # modules/myModule.js

  class App.myModule
    foo = 1
    privateFunction = ->
      foo++;
    @publicFunction: ->
      privateFunction();
      console.log foo

  # otherfile.js

  App.myModule.publicFunction(); # 2
  App.myModule.publicFunction(); # 3

{% endhighlight %}

which compiles to

{% highlight javascript %}

window.App = {};

App.myModule = (function() {
  var foo, privateFunction;

  function myModule() {}

  foo = 1;

  privateFunction = function() {
    return foo++;
  };

  myModule.publicFunction = function() {
    privateFunction();
    return console.log(foo);
  };

  return myModule;

})();

App.myModule.publicFunction(); // 2
App.myModule.publicFunction(); // 3
{% endhighlight %}

With the rails sprockets bundling, the different js files were compiled in the order specified in the manifest. There was not a way to control dependencies or load part of it asynchronously. The compiled coffee files were wrapped in a IIFE to provide isolation.

Our process has been very similar with angular


{% highlight coffee %}
  # setup file

  angular.module('myApp', [dependencies])

  # directive file

  angular.module "app"
    .directive "myDirective", (dependencies)->
      // ...

{% endhighlight %}
<br />

#### Module Patterns

From [JavaScript Modules: A Beginner’s Guide](https://medium.freecodecamp.com/javascript-modules-a-beginner-s-guide-783f7d7a5fcc): *The Module pattern is used to mimic the concept of classes (since JavaScript doesn’t natively support classes) so that we can store both public and private methods and variables inside a single object. That allows us to create a public facing API for the methods that we want to expose to the world, while still encapsulating private variables and methods in a closure scope.*

There's very good explanation on the [Learning JavaScript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) from Addy Osmani

This is the classic pattern:

{% highlight javascript %}
var testModule = (function () {
  var counter = 0;
  return {
    incrementCounter: function () {
      return counter++;
    },
  };
})();

// Increment our counter
testModule.incrementCounter();
{% endhighlight %}

He goes to show a common template:

{% highlight javascript %}
var myNamespace = (function () {

  var myPrivateVar, myPrivateMethod;

  // A private counter variable
  myPrivateVar = 0;

  // A private function which logs any arguments
  myPrivateMethod = function( foo ) {
      console.log( foo );
  };

  return {

    // A public variable
    myPublicVar: "foo",

    // A public function utilizing privates
    myPublicFunction: function( bar ) {

      // Increment our private counter
      myPrivateVar++;

      // Call our private method using bar
      myPrivateMethod( bar );

    }
  };

})();
{% endhighlight %}

#### Variation: Import mixins
This shows how to pass and alias globals (e.g jQuery, Underscore) to our module:

{% highlight javascript %}
// Global module
var myModule = (function ( jQ, _ ) {

    function privateMethod1(){
        jQ(".container").html("test");
        console.log( _.min([10, 5, 100, 2, 1000]) );
    }

    return{
        publicMethod: function(){
            privateMethod1();
        }
    };

// Pull in jQuery and Underscore
})( jQuery, _ );

myModule.publicMethod();
{% endhighlight %}


#### Variation: Exports

{% highlight javascript %}
// Global module
var myModule = (function () {

  // Module object
  var module = {},
    privateVariable = "Hello World";

  function privateMethod() {
    // ...
  }

  module.publicProperty = "Foobar";
  module.publicMethod = function () {
    console.log( privateVariable );
  };

  return module;

})();
{% endhighlight %}

#### Revealing Module pattern.

We define all of our functions and variables in the private scope and return an anonymous object with exposes the ones meant to be public: public.

{% highlight javascript %}
  var myRevealingModule = (function () {

    var privateVar = "Ben Cherry",
       publicVar = "Hey there!";

    function privateFunction() {
       console.log( "Name:" + privateVar );
    }

    function publicSetName( strName ) {
       privateVar = strName;
    }

    function publicGetName() {
       privateFunction();
    }


    // Reveal public pointers to
    // private functions and properties

    return {
       setName: publicSetName,
       greeting: publicVar,
       getName: publicGetName
    };

  })();
{% endhighlight %}

## Globals, CommonJS, AMD, UMD
With the previous patterns, we rely on a global variable that sets the namespace for that given module. This is known as the **Globals** option.
In the last years, there's been some approaches developed to account for dependency order and avoid namespace collisions, by implementing a convention that avoids going through the global scope.

### CommonJS
A CommonJS module looks like this:

{% highlight javascript %}
  // myModule.js
  function myModule() {
    this.foo = function() {
      return 'foo!';
    }
  }

  module.exports = myModule;
{% endhighlight %}

`module` is an special object that will keep a reference to the exported content provided in `myModule.js` in a way in which it can be required be calling `require('myModule')` in another file. This works on the server, where those _requires_ will load those files synchronously, this is the Node.js approach. The reference passed to `module.exports` doesn't have to be a function:


{% highlight javascript %}
  // foo.js
  var Foo = "Hey Foo"
  module.exports = Foo;

  // bar.js
  var Bar = {
    sayHi: function(){ console.log("Hi!") }
  }
  module.exports = Bar;

  // otherFile.js
  var foo = require('foo');  
  var bar = require('bar') ;
  console.log(foo);
  bar.sayHi();

{% endhighlight %}




### AMD = Asynchronous Module Definition
This is the asynchronous variant for the browser. A couple of examples:


{% highlight javascript %}
  // myModule.js
  // the empty array correspond to the dependencies (none)
  define([], function() {
    return {
      hello: function() {
        console.log('hello');
      }
    };
  });

  //myOtherModule.js
  // the empty array correspond to the dependencies (none)
  define([], function() {
    return {
      goodbye: function() {
        console.log('goodbye');
      }
    };
  });

  // otherFile.js
  // here we have `myModule`, `myOtherModule` as dependencies
  define(['myModule', 'myOtherModule'], function(myModule, myOtherModule) {
    console.log(myModule.hello());
    console.log(myOtherModule.goodbye());
  });
{% endhighlight %}


{% highlight javascript %}
// calculator.js
define("calculator", function() {
  return {
    sum: function(a, b) { return a + b; }
  };
});

// app.js
define("app", ["calculator"], function(calculator) {
  console.log(calculator.sum(1, 2)); // => 3
});
{% endhighlight %}


The `define` method can receive three parameters `define(id?, dependencies?, factory);`. The first is optional, it would be the module id, if it's not present it would be the one that the loader (in this case `RequireJS`) is expecting according to his configuration for that given file, for example:

{% highlight javascript %}
  require.config({
    baseUrl: '...',
    paths: {
        myModule: 'myModule-2.0.0.min',
{% endhighlight %}


The second argument is the `dependencies`, an array of the module (ids) required by the module that is being defined. The dependencies must be resolved prior to the execution of the module `factory` function, which is the third parameter, and the resolved values will be passed as arguments to this factory function with an order that matches those dependencies.


### UMD (Universal Module Definition)

*For projects that require you to support both AMD and CommonJS features, there’s yet another format: Universal Module Definition (UMD).
UMD essentially creates a way to use either of the two, while also supporting the global variable definition. As a result, UMD modules are capable of working on both client and server.*

Here there are some patterns to achieve it https://github.com/umdjs/umd

Example:

{% highlight javascript %}
  // calculator.js
  (function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports)
      module.exports = definition();
    else if (typeof define == 'function' && define.amd)
      define(name, definition);
    else
      context[name] = definition();
  }('calculator', this, function () {
    // your module here!
    return {
      sum: function(a, b) { return a + b; }
    };
  });
{% endhighlight %}



This is an example for the [Rmodal library](http://rmodal.js.org/), that supports CommonJS, AMD or globals.

{% highlight javascript %}
  // https://github.com/zewish/rmodal.js/blob/master/src/rmodal.js

  (function(window, document) {
      "use strict";
    // ...
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        define(function() {
            return RModal;
        });
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = RModal;
    }
    else {
        window.RModal = RModal;
    }
    })(window, document);    
{% endhighlight %}



### ES6 Modules

With the new ECMAScript edition, we have native support for a new type of modules. An ES6 module is a file containing JS code. That file is automatically in strict mode, and you can use the keywords `import` and `export` inside it.

In that file everything you declare is local to the module, we use `export` to make something public.

{% highlight javascript %}
// foo.js

export function foo() {
  console.log("foo")
}

export class Bar {
  // ...
}

// you can export it later with a Export List

function sayHi(){
  //...
}

function sayBye(){
  //...
}

export {sayHi, sayBye};


// otherFile.js

import {sayHi} from "foo.js";
sayHi();

{% endhighlight %}


You can also rename both your exports and imports

{% highlight javascript %}

// foo.js

export { sayHi as hi };

// also several at once:

export {
  sayHi  as hi,
  sayBye as bye
};

// otherFile.js

import { hi } from "foo.js";
import { bye as byebye } from "foo.js";

{% endhighlight %}


To play nice with CommonJS and AMD modules, ES6 treats them as if they had a `default` export:

{% highlight javascript %}
npm install lodash
import {each, map} from "lodash";
import {default as _} from "lodash";
// shorthand
import _ from "lodash";

// This default export is nothing special, you can define your own
// foo.js

function foo() {
  console.log("foo")
}

export {foo as default};
// short hand
export default foo;
{% endhighlight %}


Module objects:  you can get the imports as properties from a module namespace object:

{% highlight javascript %}
// foo.js

function sayHi(){
  //...
}

function sayBye(){
  //...
}

export {sayHi, sayBye};


// otherFile.js

import * as foo from "foo.js";
foo.sayHi();
foo.sayBye();

// this doesn't seem to exist : /
// import { sayHi } as foo from "foo.js";

// There is also a shorthand to import and then re-export:

export { sayHi, sayBye } from "foo.js"
export * from "yetAnotherFile.js"

{% endhighlight %}


Some more good notes from * [Es6 In-Depth Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules):

- *All exported identifiers must be explicitly exported by name in the source code. You can’t programmatically loop through an array and export a bunch of names in a data-driven way.*

- *Module objects are frozen. There is no way to hack a new feature into a module object, polyfill style.*

- *There is no error recovery for import errors. An app may have hundreds of modules in it, and if anything fails to load or link, nothing runs. You can’t import in a try/catch block. (The upside here is that because the system is so static, webpack can detect those errors for you at compile time.)*



Links:

- [https://medium.freecodecamp.com/javascript-modules-a-beginner-s-guide-783f7d7a5fcc](https://medium.freecodecamp.com/javascript-modules-a-beginner-s-guide-783f7d7a5fcc)
- [https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript)
- [http://www.leanpanda.com/blog/2015/06/28/amd-requirejs-commonjs-browserify/](http://www.leanpanda.com/blog/2015/06/28/amd-requirejs-commonjs-browserify/)
- [https://medium.freecodecamp.com/javascript-modules-a-beginner-s-guide-783f7d7a5fcc](https://medium.freecodecamp.com/javascript-modules-a-beginner-s-guide-783f7d7a5fcc)
- [https://hacks.mozilla.org/2015/08/es6-in-depth-modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules)
