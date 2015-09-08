---
layout: post
title: Vagrant not updating Files
heading-class: "post-heading-only-image-compact"
subtitle: After switching from rsynced folders to NFS we noticed that some files didn't update on the VM
---

{{ page.title }}
================

<p class="meta">July 25th, 2014 - Göttingen</p>

This has been driving us nuts for almost a year. After switching from rsynced folders to NFS - which provides a more than noticeable speed boost -, we noticed that some files didn't update on the VM, even after a sequence of carefully executed attempts to load the new version of the file (such as reloading the page like a mad man while crying...).

Some files appeared to be just cursed, and after using a fresh provisioned VM for some weeks things appeared to get worse. This is hard to verify since it could be a perception issue, and as a project grows with time the number of files naturally increases (which could be also playing a role). We now believe the origin of the problem to be an accumulation of corrupted cache files, which would be coherent with that observation.

In our Rails code, models and controllers usually got updated with issues, but the css and js files - which are compiled along with multiple related files - were just a nightmare. We started adding lines like <code>console.log "random-number-123-please-work"</code> and <code>* {background: green !important}</code> just to quickly assert that the files were being reloaded, and this was so discouraging that we considered giving up on vagrant altogether.

We have been looking for solutions without much success, I'll list them beneath just in case they might also help.

For us this is the magic (and quite horrible) solution:

    sudo su
    sync; echo 3 > /proc/sys/vm/drop_caches

We run "sync" first in order to make sure all cached objects are freed, the next command makes the kernel drop clean caches, dentries and inodes from memory (see this <a href='http://unix.stackexchange.com/questions/81960/is-sync-before-drop-caches-necessary'>link</a>).

It is unclear for us what is going on with this cached files, but cleaning them up when we detect the error works like a charm. The <em>hardcore</em> version of this command would be:

    watch -n1 "sync; echo 3 > /proc/sys/vm/drop_caches"

Which basically flushes the cache every second. <a href='http://superuser.com/questions/242928/disable-linux-read-and-write-file-cache-on-partition/464382'>Here</a> there's a solution to disabled page caching for a given application, but I haven't tested it yet.

The other two possible culprits that we read about were the atomic saves in Sublime and the Sendfile option in nginx. We did as they suggested but it wasn't enough in our case:

<br />

Sublime Text Atomic Save
========================

This seems to be related to the NFS not picking up on changes in files whose size stays the same.

To disable it, go to > Preferences > Settings-User  and add:

    {
        "atomic_save": false
    }

<br />
<br />

Nginx Sendfile
==============

Nginx has a sendfile directive that allows to use the Linux kernel’s sendfile operation to read the requested file from disk. This is known to cause problems in VMs (is even listed in the nginx pitfalls section http://wiki.nginx.org/Pitfalls).

To disabled it just set this line in your nginx.conf:

    sendfile off;


<br />
<br />
-----

After a long time searching I couldn't come up with a better solution than dropping the caches, nor have we found a satisfactory explanation as to why this happen to us so often when updating js and css files (although we suspect that this is connected to the asset pipeline, and the multiple files concerned to update the application.js/css compiled file)

Here are all the relevant links that I could find on this subject:

* <a href='https://github.com/mitchellh/vagrant/issues/2768'>https://github.com/mitchellh/vagrant/issues/2768</a>
* <a href='http://unix.stackexchange.com/questions/81960/is-sync-before-drop-caches-necessary'>http://unix.stackexchange.com/questions/81960/is-sync-before-drop-caches-necessary</a>
* <a href='http://www.linuxatemyram.com/play.html'>http://www.linuxatemyram.com/play.html</a>
* <a href='http://www.conroyp.com/2013/04/25/css-javascript-truncated-by-nginx-sendfile/'>http://www.conroyp.com/2013/04/25/css-javascript-truncated-by-nginx-sendfile/</a>
* <a href='https://www.sumardi.net/clear-nginx-cache-in-vagrant/'>https://www.sumardi.net/clear-nginx-cache-in-vagrant/</a>
* <a href='https://github.com/mitchellh/vagrant/issues/351#issuecomment-1339640'>https://github.com/mitchellh/vagrant/issues/351#issuecomment-1339640</a>
* <a href='http://serverfault.com/questions/30240/disable-all-disk-caching-for-apache2-on-linux'>http://serverfault.com/questions/30240/disable-all-disk-caching-for-apache2-on-linux</a>
* <a href='http://superuser.com/questions/242928/disable-linux-read-and-write-file-cache-on-partition'>http://superuser.com/questions/242928/disable-linux-read-and-write-file-cache-on-partition</a>
* <a href='http://serverdown.ttwait.com/que/534507'>http://serverdown.ttwait.com/que/534507</a>
