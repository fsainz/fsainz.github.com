---
layout: post
title: Uploading files with Electron
comments: true
---

{{ page.title }}
================

<p class="meta">June 8th, 2015 - Bonn</p>
<img src="/images/electron.png" />

We are developing an app with  <a href="http://electron.atom.io/">electron</a> in which we need to upload files directly from the filesystem (not through a form).

We had some issues with it, first the file contents were getting munged on the remote end. We were extracting a blog with the file data using a conventional method:

{% highlight ruby %}
contents = fs.readFileSync fileLocation
blob = new Blob([contents])
{% endhighlight %}

Then we transmitted this blob via every method we could think of, from basic ajax requests with `XMLHttpRequest` and a `FormData` object to specialised plugins like jQuery-File-Upload, always with the same result. For some reason we ended up with a file with invalid bytes.

Out theory was the the `readFile` function was transforming the original byte array into UTF-8 forcing some replacements due to invalid characters. We went through the other available encoding options ("raw", "binary", etc..) without too much success until we tried with base64

{% highlight ruby %}
contents = fs.readFileSync fileLocation, "base64"
blob = new Blob([contents])
{% endhighlight %}

After decoding it, we had the right contents, and we faced the second problem. The 20k test file had worked pretty well, but any file slightly larger than that would just crash electron when trying to turn it into a blob. If we didn't change the default encoding, we could get a blob of a several megabyte file without issues.

After asking in the electron issues board, @zcbenz pointed us in the right direction. The way to go was to use Node's http module, since HTML5 didn't work well together with Node.js's Buffer.

At the end we used the [request module](https://github.com/request/request) which makes writing the http post request a little nicer. These are the relevant lines from our Attachment model:


{% highlight ruby %}
# Inside attachment.coffee

nodeRequest = require('request')
#
#
  upload: ->
    @filePath().then (fileLocation)=>
      filename = @name
      url = dockingApi.attachments.postUrl(@id, @attachable_id, @attachable_type)
      deferred = $q.defer()
      formData =
        file:
          value: fs.createReadStream( fileLocation )
          options:
            filename: filename
      nodeRequest.post {
        url: url
        formData: formData
      }, (err, httpResponse, body) ->
        if err
          console.error('upload failed:', err)
        deferred.resolve()
      deferred.promise
{% endhighlight %}
