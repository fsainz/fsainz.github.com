---
layout: post
title: to have and not_to have in capybara gotcha
comments: true
---

{{ page.title }}
================

<p class="meta">June 9th, 2013 - Göttingen</p>

We were writing some tests to make sure that same elemets were showed on the
page only under certain circunstances when we found a seemingly contradictory behaviour of the *have_content* matcher.

We had an scenario involving loading more content from an ajax request
similar to this: 

{% highlight ruby %}

-# test.html.haml

:javascript
  $(function(){
    $("#load_btn").click(function(){
     $("#foo").load("/dev/bar")
    })
  })

= button_tag("load", id:"load_btn")

#foo


-# dev_controller.rb

def bar
  render text:"new content"
end
{% endhighlight %}


On our test we were checking that the response was showed on the page: 

{% highlight ruby %}
# test.rb

describe "Capybara test" do
  it "should be able to find an element", js:true do
    visit "/dev/test"
    find("#load_btn").click()
    expect(page).to have_content("new content")
  end
end
{% endhighlight %}


To verify that we were indeed testing this we tried to fail the test matching the opposite:

{% highlight ruby %}
it "should be able to find an element", js:true do
  visit "/dev/test"
  find("#load_btn").click()
  expect(page).to_not have_content("new content")
end
{% endhighlight %}

but this test passes smoothly. Actually, you can put both opposite
expectations together and the test will pass:


{% highlight ruby %}
it "should be able to find an element", js:true do
  visit "/dev/test"
  find("#load_btn").click()
  expect(page).to_not have_content("new content")
  expect(page).to have_content("new content")
end
{% endhighlight %}


What gave us the clue about what was happening is that changing the order
makes the test fail:

{% highlight ruby %}
it "should be able to find an element", js:true do
  visit "/dev/test"
  find("#load_btn").click()
  expect(page).to have_content("new content")
  expect(page).to_not have_content("new content")
end
{% endhighlight %}

It seems that capybara waits for the request to finish when the
expectation fails but moves along happily if it passes.

To actually test that the new content wasn't being loaded, we had to
force capybara to wait before evaluating the assertion: 

{% highlight ruby %}

# This test fails as intended:
it "should be able to find an element", js:true do
  visit "/dev/test"
  find("#load_btn").click()
  wait_until { page.evaluate_script('$.active') == 0 }
  expect(page).to_not have_content("new content")
end
{% endhighlight %}


