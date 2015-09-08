---
layout: post
heading-class: "post-heading-only-image-compact"
title: Natural Ergonomic Keyboard 4000 on the mac with a twist
---

{{ page.title }}
================

<p class="meta">January 12th, 2012 - Madrid</p>

I got a <a href="http://www.microsoft.com/hardware/en-us/p/natural-ergonomic-keyboard-4000/B2M-00012
">Microsoft Keyboard 400</a> three years ago, I wanted to start
resting my wrists while typing and learn to type properly for that
matter.

<img src="/img/keyboard4000.jpeg" />

I've had a problem with this keyboard, there's not a
spanish version available and mapping the keys in my head for the UK layout while switching to a spanish keyboard and from macs to pcs was always a pain, I kept glancing over the keys time to time and never got over my old typing habits.

The best solution that I could think of was to get rid of the misplaced key signs and find a way to remap the keys exactly as the spanish macbook's layout:

<br />
<br />

*** Paint it Black ***

I wanted a DIY version of <a href="http://www.daskeyboard.com/model-s-ultimate/">Das Keyboard Ultimate</a>

<img src="/img/das_keyboard.jpg" />

I've both a couple of cheap black nail polishes

<img src="/img/P7273956.jpg" />

and applied a thin double layer. So far it's holding like a charm and it
feels pretty much the same while typing as the non-painted keys.

<img src="/img/P7273948.jpg" />


<br />
<br />

*** Remmaping keys from PC to MAC and from UK to Spanish layout ***

I tried the Microsoft IntelliType for the mac to make some adjustments but I couldn't get some keys to work as i wanted, then I found <strong><a href="http://pqrs.org/macosx/keyremap4macbook/">KeyRemap4MacBook</a></strong>, which let's you do anything you can imagine, it's free, it's on github and it has a great documentation and community.

There's pleanty of keys to remap, but so far I'm satisfied with these
two settings:

<img src="/img/KeyRemap4MacBook.png" />

The "Sawp Ordinal-indicator and Less-Than" was working well with the 4000, but it was swapping the keys on
my macbook as well. It turns out that you can
<a href="http://pqrs.org/macosx/keyremap4macbook/document-misc.html.en"> define
multiple configurations</a> and change from one another from the MenuBar tab.

But there's something even better, KeyRemap4MacBook let's you
<a href="http://pqrs.org/macosx/keyremap4macbook/xml-devicedef.html.en
">define a device specific setting</a> and create a setting for your
keyboard's Vendor ID and Product ID.

I put this into my private.xml, and then I discovered that they had it
already listed on their
<a href="https://github.com/tekezo/KeyRemap4MacBook/blob/version_7.8.0/src/core/server/Resources/devicevendordef.xml">Prepared Vendor IDs</a>
and <a href="https://github.com/tekezo/KeyRemap4MacBook/blob/version_7.8.0/src/core/server/Resources/deviceproductdef.xml">Prepared Product IDs</a>

<br />
    <?xml version="1.0"?>
      <root>
        <devicevendordef>
          <vendorname>MICROSOFT_CORPORATION</vendorname>
          <vendorid>0x045e</vendorid>
        </devicevendordef>

        <deviceproductdef>
          <productname>KEYBOARD_4000</productname>
          <productid>0x00db</productid>
        </deviceproductdef>

        <item>
          <name>Swap ordinal-indicator(º) and less-than(&lt;)</name>
          <identifier>private.remap.spanish_swap_ordinal_indicator_lessthan</identifier>
          <device_only>DeviceVendor::MICROSOFT_CORPORATION, DeviceProduct::KEYBOARD_4000</device_only>
          <autogen>--KeyToKey-- KeyCode::SPANISH_ORDINAL_INDICATOR, KeyCode::SPANISH_LESS_THAN</autogen>
          <autogen>--KeyToKey-- KeyCode::SPANISH_LESS_THAN, KeyCode::SPANISH_ORDINAL_INDICATOR</autogen>
        </item>
      </root>



The explain you how to get those autogen codes, but since they already
had defined this key swap, I went directly to the repo for the  <a href="https://raw.github.com/tekezo/KeyRemap4MacBook/master/src/core/server/Resources/include/checkbox/languages/spanish.xml">spanish.xml</a>.

They seem to have change the <code>--KeyToKey--</code> to <code>\_\_KeyToKey\_\_</code> recently, I had to use dashes for the last released version.


After reloading the private.xml, these are my settings:

<img src="/img/KeyRemap4MacBook2.png" />


<hr />

Now I need some typing excercises, I trying these ones out:


** update ** This one is free, it has a ton of keyboard layouts, speed tests and games.<br/>
**<a href="http://www.typingstudy.com/">typing-study</a>**
<img src="/img/typingstudy.png" />


**<a href="http://typingclub.com">typingclub.com</a>**
<img src="/img/typingclub.png" />

**<a href="http://type-fu.com">type-fu.com</a>**
<img src="/img/typefu.png" />

**<a href="https://typing.io/">typing-io</a>**
<img src="/img/typing-io.png" />
