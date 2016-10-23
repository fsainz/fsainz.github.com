---
layout: post
title: Ruby Regular Expressions
heading-class: "post-heading-only-image-compact"
---

{{ page.title }}
================

<p class="meta">October 23rd, 2016 - Bonn</p>

I wrote this reference as a summary / cheatsheet about how to use regular expressions in ruby along with some tips

{% highlight ruby %}
### DIFFERENT WAYS OF MATCHING

"Use the force" =~/force/ # => 8   index of the first occurrence of the word
"Use the fork" =~ /force/ # => nil
"Use the fork" !~ /force/ # => true

"Use the force"[/force/] # => "force"
"Use the fork"[/force/]  # => nil

"Use the force".match /force/  #=> #<MatchData "force">
"Use the fork".match /force/ #=> nil

"Use the force"[/(the) force/, 1] # => "the" # first capture (index of MatchData)
"Number 123"[/(?<number>\d+)/, "number"] => "123"

# (!) str =~ regexp is not exactly the same as regexp =~ str.
# Strings captured from named capture groups are assigned to local variables only in the second case
/(?<number>\d+)/ =~ "Number 123"; number #=> "123"  # This works
"Number 123" =~ /(?<number>\d+)/; number # => NameError: undefined local variable
"Number 123"[/(?<number>\d+)/]; number # => NameError: undefined local variable

# Example of named captures in Rubular => http://rubular.com/r/SZDykFX2nr
# Rubular is awesome

#### GLOBAL VARIABLES / Regexp.last_match
# These matching operations leave us with some global variables with the result of the match, but
# is better to use Regexp.last_match for clarity
str = "Lord of the 7 Kingdoms, and Protector of the Realm"
str[/the (\d+) kingdoms?+/i]
str.match(/the (\d+) kingdoms?+/i)
str =~ /the (\d+) kingdoms?+/i

Regexp.last_match    # same as $~                  # => #<MatchData "the 7 Kingdoms" 1:"7">
Regexp.last_match(0) # matched string, same as $&  # => "the 7 Kingdoms"
Regexp.last_match(1) # first capture, same as $1   # => 7
Regexp.last_match(n) # nth capture, same as $n
Regexp.last_match.pre_match   # same as $`         # => "Lord of "
Regexp.last_match.post_match  # same as $'         # => ", and Protector of the Realm"

### WORKING WITH MATCHES
match_data = "Jack Johnson".match /(\w*)\s(\w*)/ #=> #<MatchData "Jack Johnson" 1:"Jack" 2:"Johnson">
match_data.to_a
#=> [
#  [0] "Jack Johnson", # matched string
#  [1] "Jack",         # first capture
#  [2] "Johnson"       # second capture
#]
match_data.captures
#=> [
#  [0] "Jack",
#  [1] "Johnson"
#]

match_data = "Number 123".match /(?<number>\d+)/ #=> #<MatchData "123" number:"123">
match_data[:number] # => 123  # same as match_data.captures[0], match_data[1]

"Number 123 456".scan(/\d+/)
#=> [
#  [0] "123",
#  [1] "456"
#]

"Number 123 456".scan(/(?<number>\d+)/)
#=> [
#  [0] [
#    [0] "123"
#  ],
#  [1] [
#    [0] "456"
#  ]
#]

# In this last case, the named variable is not helping much, if we do "..".scan(...){|m| ...}
# that m could be a string or an array, it might be cleaner just to use Regexp.last_match within the block

"Number 123 456".scan(/(?<number>\d+)/){ puts Regexp.last_match(:number) }
# => 123
# => 456


"123 456 789".scan(/(\d)(\d)(\d)/)  #=> [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]]

### REPLACEMENTS
"that man is superman".sub /man/, "bird"   #=> "that bird is superman"  # replaces once
"that man is superman".gsub /man/, "bird"  #=> "that bird is superbird" # global sub
# we also have sub!, gsub!

other options:

str = "that man is superman"
str[/man/] = "man"
str #=> "that bird is superman" # like sub!

str = "foo bar"
str[/(\w*) (\w*)/, 2] = "baz" # you can target a capture
str # => "foo baz"

# We can reference a capture with \1, \2 ...
"123 456 789".gsub(/(\d+)/, '[\1]') #=> "[123] [456] [789]"

# For more complex changes we can use a block
"WHAT'S GOING ON?".gsub(/\S*/) {|s| s.downcase } # => "what's going on?"
# All of them do the same:
"123 456 789".gsub(/(\d+)/) { |m| m.to_i * 2 }
"123 456 789".gsub(/(\d+)/) { $1.to_i * 2 }
"123 456 789".gsub(/(\d+)/) { Regexp.last_match(0).to_i * 2 }
"123 456 789".gsub(/(?<digits>\d+)/) { $~[:digits].to_i * 2 }
"123 456 789".gsub(/(?<digits>\d+)/) { Regexp.last_match(:digits).to_i * 2 }
#=> "246 912 1578"

# You can also pass a hash to espicify matched_string => replacement pairs, such as:
"Mr".gsub(/M(iste)?r/  'Mister' => 'Doctor', 'Mr' => 'Dr')     #=> Dr
"Mister".gsub(/M(iste)?r/, 'Mister' => 'Doctor', 'Mr' => 'Dr') #=> Doctor

# More recomendations from our guidelines:
url.gsub('http://', 'https://') # bad, there is only one substitution, use sub
url.sub('http://', 'https://')  # good
str.gsub('-', '_') # bad - there is a more specialized / performant alternative
str.tr('-', '_')   # good


# A BUNCH OF USEFUL METHODS AND TIPS
# partition
# >> Searches sep or pattern (regexp) in the string and returns the part before it, the match, and the part after it.
# >> If it is not found, returns two empty strings and str.

"hello".partition("l")         #=> ["he", "l", "lo"]
"hello".partition(/l/)         #=> ["he", "l", "lo"]
"hello".partition("x")         #=> ["hello", "", ""]

# start_with?, end_with? include?
# from our guides: Prefer Ruby's Standard Library methods (start_with?, end_with?) over ActiveSupport aliases (starts_with?, ends_with?)
"Use the force".start_with?("Use") # => true
"Use the force".include?("the")  # => true
"Use the force".end_with?("force") # => true

# Regex equality ===
/hello/ === "hello" # => true   (but "hello" === /hello/ => false)
# Is meant to be used within case statements
str = "HELLO"
case str
when /^[a-z]*$/; puts "Lower case"
when /^[A-Z]*$/; puts "Upper case"
else;            puts "Mixed case"
end
#=> "Upper case"

# From our guides:
# Use %r only for regular expressions matching at least one '/' character

%r{\s+} # bad
%r{^/(.*)$} # good
%r{^/blog/2011/(.*)$} # good

# Use non-capturing groups when you don't use the captured result
/(first|second)/ # bad
/(?:first|second)/ # good

#Be careful with ^ and $ as they match start/end of line, not string endings.
# If you want to match the whole string use: \A and \z (not to be confused with \Z which is the equivalent of /\n?\z/)

string = "some injection\nusername"
string[/^username$/]   # matches
string[/\Ausername\z/] # doesn't match

#Use x modifier for complex regexps. This makes them more readable and you can add some useful comments. Just be careful as spaces are ignored
regexp = /
  start         # some text
  \s            # white space char, you could also use [ ]
  (group)       # first group
  (?:alt1|alt2) # some alternation
  end
/x

#The interpolation accepts anything that can be stringified. Even better, I can use another regexp.
GITHUB_COM = %r{https?://(?:www\.)?github\.com}i
%r{\A#{GITHUB_COM}/([^/]+)/?\z}o  # The o flag at the end optimizes the regexp by only doing the interpolation once. Don’t use o with dynamic content.

# Name your matches.
# Sometimes a single regexp will capture several pieces of information. Instead of capturing a username consider the case where I want a username and project.
r = %r{\A#{GITHUB_COM}/([^/]+)/([^/]+)/?\z}o
m = r.match('http://github.com/AaronLasseigne/dotfiles') #=> #<MatchData "http://github.com/AaronLasseigne/dotfiles" 1:"AaronLasseigne" 2:"dotfiles">
m[1] #=> "AaronLasseigne"
m[2] #=> "dotfiles"

# compared to:
r = %r{\A#{GITHUB_COM}/(?<username>[^/]+)/(?<project>[^/]+)/?\z}o
m = r.match('http://github.com/AaronLasseigne/dotfiles') #=> #<MatchData "http://github.com/AaronLasseigne/dotfiles" username:"AaronLasseigne" project:"dotfiles">
m[:username] #=> "AaronLasseigne"
m[:project]  #=> "dotfiles"

# NEW IN RUBY 2.4

# Regexp#match? 3x times faster than ===, =~, match; returns a boolean and does not set global variables
/^foo (\w+)$/.match?('foo wow') # => true
$~                              # => nil

# MatchData#named_captures, #values_at
pattern  = /(?<first_name>John) (?<last_name>\w+)/
pattern.match('John Backus').named_captures # => { "first_name" => "John", "last_name" => "Backus" }
pattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
pattern.match('2016-02-01').values_at(:year, :month) # => ["2016", "02"]

### REFERENCES AND ADVANCED TOPICS (CONDITIONALS, BACKTRACKING, ATOMIC...)
http://aaronlasseigne.com/2016/07/08/5-tips-for-writing-a-legible-regexp/
http://blog.honeybadger.io/using-conditionals-inside-ruby-regular-expressions/
http://idiosyncratic-ruby.com/11-regular-extremism.html
http://aaronlasseigne.com/2016/06/10/proper-regexp-anchoring/
http://revelry.co/quick-tip-using-regexp-replace-last-occurrence-ruby/
https://github.com/bbatsov/ruby-style-guide#regular-expressions
http://batsov.com/articles/2013/10/03/using-rubys-gsub-with-a-hash/
http://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags/1732454#1732454

{% endhighlight %}

