---
layout: post
title: Managing CSS 2/4 - A GUI for your app
comments: true
---

{{ page.title }}
================

<p class="meta">October 18th, 2013 - Göttingen</p>

On our last project, we have taken the approach of treating our html/css as a set of visual modules derived from a common library of reusable components. This means that whenever we needed to style a page, we opened up our library showcase and picked the elements we needed. If we were looking for something that wasn't there, we had to implement it first as an application agnostic module before applying it elsewhere.

The advantage of going through this step is that it helps think in terms of what the module visually does on its own (since you isolate it from its surroundings within the application), and what role it is going to have among the other components (may be it should be merged into another component, or may his function is already covered by a similar component and it doesn't make sense to add it)

Having a library makes you style your pages faster since it gives you one place to look through all the available styles at hand, and leads to reusability. Another advantage is that it acts both as a playground and a test page, now you have one page to load in order to check that the core components of your site look good on IE.

This is how our library looks:

<img src="/images/gui.png" />


To get some guideance of how to organize and design your own components is useful to check <a href="http://getbootstrap.com/">Bootstrap</a> and <a href='http://foundation.zurb.com/docs/'>Foundation</a>.  

Apart from this library there is going to be other styles related to layouts and very specific views. Reusable components can be tricky to design and your pricing table doesn't need to be one of them. 

Also, there will be plenty of times in which you need a quick hack or you don't have time (or mental energy..) to document the new component or transform it into a proper reusable element. Patterns are visible after defining half a dozen semi-unrelated classes, and refactor them takes effort.

For those cases in which you want fix something fast, or you have no idea where to put those lines within the library, we have a <strong>misc.css</strong> stylesheet. The idea is to condense all the <em>messiness</em> in just one file instead of leaving them around. This junk draw can be cleaned up time to time much more easily and it makes us feel better.

Recently I read about a more solid and well explained version of this concept ; ) <a href="http://csswizardry.com/2013/04/shame-css/" target="_blank">shame.css</a>

I think we'll rename it eventually, but <em>misc</em> reminds me of this strip:

<img src="/images/home_organization.png" />
<a href="http://xkcd.com/1077/">http://xkcd.com/1077/</a>


Our css bundle follows this order:

{% highlight ruby %}

/* COMPASS LIBRARIES */
$experimental-support-for-svg: true;
@import "compass/utilities/general/hacks"; 
@import "compass/css3/border-radius";
@import "compass/utilities/color/contrast";
/* (....) */


/* BOOTSTRAP, PLUGINS, VENDOR */
@import "gui/bootstrap_and_overrides";
@import "plugins/jquery.Jcrop";
@import "plugins/icomoon";
/* (....) */


/* OUR MIXINS AND GUI COMPONENTS*/
@import "gui/colors";
@import "gui/utilities";
@import "gui/typography";
@import "gui/buttons";
@import "gui/alerts";
@import "gui/explains";
@import "gui/icons";
@import "gui/placeholders";
@import "gui/dividers";
@import "gui/lists";
@import "gui/navs";
@import "gui/forms";
@import "gui/overlay";
@import "gui/switch";
@import "gui/media";
/* (....) */



/* LAYOUTS */
@import "layouts/frontpage";
@import "layouts/dashboard";
@import "layouts/single";
@import "layouts/web";
/* (....) */



/* SHARED VIEWS */
@import "shared/global_header";
@import "shared/global_footer";
@import "shared/new_entry";
@import "shared/entries_editor";
/* (....) */


/* VIEW SPECIFICS */
@import "layouts/dashboard/preferences";
@import "layouts/dashboard/collection_forms";
@import "layouts/dashboard/feed";
/* (....) */


/* MISC */
// PUT EVERYTHING MESSY HERE 
// Because misc is better than having tiny bits all around
// http://xkcd.com/1077/
@import "misc";


{% endhighlight %}


