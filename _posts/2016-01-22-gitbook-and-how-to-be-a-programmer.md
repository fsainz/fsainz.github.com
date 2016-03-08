---
layout: post
title: Robert L. Read - How to be a programmer
subtitle: Notes about the book
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">January 15th, 2016 - Bonn</p>


I read the book _How to be a Programmer_ from Robert L. Read. It's available on github at [https://github.com/braydie/HowToBeAProgrammer](https://github.com/braydie/HowToBeAProgrammer) and at gitbooks [https://braydie.gitbooks.io/how-to-be-a-programmer/content/en/index.html](https://braydie.gitbooks.io/how-to-be-a-programmer/content/en/index.html)

I'm saving these notes a reference.

<blockquote>
<strong>printlining</strong>

<p>The insertion of statements into a program on a strictly temporary basis that output information about the execution of the program for the purpose of debugging.</p>

<p>Some beginners fear debugging when it requires modifying code. This is understandable - it is a little like exploratory surgery.</p>

<p>Logging is the practice of writing a system so that it produces a sequence of informative records, called a log. Printlining is just producing a simple, usually temporary, log.</p>


<p>The amount to output into the log is always a compromise between information and brevity. Too much information makes the log expensive and produces <strong>scroll blindness</strong>, making it hard to find the information you need. Too little information and it may not contain what you need.</p>

 <p>There is a famous dictum that 90% of the time will be spent in 10% of the code</p>

<p>Logging <strong>wall-clock time</strong> is particularly valuable because it can inform about unpredictable circumstances that arise in situations where other profiling is impractical.</p>

<p>Contention for shared resources that are synchronized can cause <strong>deadlock and starvation</strong>. Deadlock is the inability to proceed because of improper synchronization or resource demands. Starvation is the failure to schedule a component properly.</p>

<p>The key to improving the performance of a very complicated system is to analyse it well enough to find the bottlenecks, or places where most of the resources are consumed. This kind of improvement is sometimes called <strong>low-hanging fruit</strong>, meaning that it can be easily picked to provide some benefit.</p>

<p>Space that needs to persist beyond the scope of a single subroutine is often called <strong>heap allocated</strong>. A chunk of memory is useless, hence garbage, when nothing refers to it. Depending on the system you use, you may have to explicitly deallocate memory yourself when it is about to become garbage. More often you may be able to use a system that provides a garbage collector.</p>

<p>Although after 8 hours you will start to doubt it, the <strong>intermittent bug</strong> has to obey the same laws of logic everything else does.</p>


 <p>There is a lot of room for miscommunication about estimates, as people have a startling tendency to think wishfully that the sentence:
 "I estimate that, if I really understand the problem, it is about 50% likely that we will be done in five weeks (if no one bothers us during that time)."
 really means:
 "I promise to have it all done five weeks from now."</p>

 <p>Estimation takes practice. It also takes labour. It takes so much labour it may be a good idea to estimate the time it will take to make the estimate, especially if you are asked to estimate something big.</p>

<p>The most important thing is not to leave anything out. For instance, documentation, testing, time for planning, time for communicating with other groups, and vacation time are all very important.</p>

<p>When stumped, take a break.</p>

<p>Computer programming is an activity that is also a culture. The unfortunate fact is that it is not a culture that values mental or physical health very much. For both cultural/historical reasons (the need to work at night on unloaded computers, for example) and because of overwhelming time-to-market pressure and the scarcity of programmers, computer programmers are traditionally overworked.</p>

<p>There is a certain amount of mental inertia associated with getting warmed-up to a problem and deeply involved in it. Many programmers find they work best when they have long, uninterrupted blocks of time in which to get warmed-up and concentrate.</p>

<p>You should carefully choose how abstract you need to be. Beginning programmers in their enthusiasm often create more abstraction than is really useful.  This is a form of <strong>speculative programming</strong> -> Producing a feature before it is really known if that feature will be useful.</p>

<p>*used in the book, from wikipedia: In computer science, a <strong>mutator method</strong> is a method used to control changes to a variable. They are also widely known as setter methods</p>

<p>Perhaps because they project their own behaviour onto us, they believe that asking for it sooner will make us work harder to get it there sooner. This is probably actually true, but the effect is very small, and the damage is very great.</p>

<p>I believe contractors and consultants often have tremendous problems getting their clients to clarify in their own minds what they really want. If you intend to be a consultant, I suggest you choose your clients based on their clear-headedness as well as their pocketbooks.</p>

<p>How to Handle Boring Tasks
If all else fails, apologize to those who have to do the boring task, but under no circumstances allow them to do it alone.</p>

<p>One of the most unpleasant and common things you will have to say is, ‘The schedule will have to slip.’ The conscientious programmer hates to say this, but must say it as early as possible. There is nothing worse than postponing action when a milestone slips, even if the only action is to inform everyone. In doing this, it is better to do it as a team, at least in spirit, if not physically. You will want your team's input on both where you stand and what can be done about it, and the team will have to face the consequences with you.</p>
</blockquote>
