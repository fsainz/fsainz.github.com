---
layout: post

title: Vagrant Issues 
---

{{ page.title }}
================

<p class="meta">September 16th, 2012 - Madrid</p>

<img src="/images/vagrant.jpg" />

<br />

<a href="http://vagrantup.com/">Vagrant</a> is a very useful tool to work develop within virtual environments, which let's you mimic more precisely your server in any development machine, share the exact same environment between developers and get a new machine ready for development in a faster and more predicatably way. 
 
We've been using it for almost a year now and we've compiled this list
of issues and solutions:


###NFS Problems

>  "Mounting NFS shared folders failed. This is most often caused by the NFS
>  client software not being installed on the guest machine. Please verify
>  that the NFS client software is properly installed, and consult any resources
>  specific to the linux distro you're using for more information on how to
>  do this."
  
In spite of that "most often caused", that's never been our case, to
rule it out try this on your vagrant machine:

    sudo apt-get install nfs-common -y
    sudo shutdown -r now && exit

We had that error message after messing with several boxes at the same
time, and also after copying a vagrant folder from one project to the
other, see *wrong virtualbox - vagrant - project association*
<br />

###RAILS server behaving very slow, getting to extremely slow when offline
from the vagrant website: "In order to keep SSH access speedy even when your host computer can't access the internet, be sure to set UseDNS to no in /etc/ssh/sshd_config. This will disable DNS lookup of clients connecting to the server, which speeds up SSH connection."

    sudo bash -c "echo 'UseDNS no' >> /etc/ssh/sshd_config"

to prevent webrick from doing this reverse dns lookup, locate the
webrick/config.rb of your webrick gem and change the line <code>:DoNotReverseLookup => nil,</code>
to <code>true</code>


    # sudo vi /usr/local/rbenv/versions/1.9.2-p290/lib/ruby/1.9.1/webrick/config.rb

    :DoNotReverseLookup => true,

<br />


###Interface flags error  
>    SIOCSIFADDR: No such device<br />
>    eth1: ERROR while getting interface flags: No such device<br />
>    SIOCSIFNETMASK: No such device<br />
>    eth1: ERROR while getting interface flags: No such device<br />
>    Failed to bring up eth1.<br />


we had this problem some times after packaging. It's related to the way
ubuntu and debian cache the network interfaces configuration, the MAC of
one developer machine was being stored and causing trouble when other
developer tried to use the same box. To fix it just get ride of this file 
<code>/etc/udev/rules.d/70-persistent-net.rules</code> and restart the machine.
<br />


###Wrong virtualbox - vagrant - project association

Vagrant creates an association between his boxes and the Virtualbox images in vagrant/.vagrant (basically just a string identifying the machine for each environment), if you are unaware of this as we were and copy this file accidentally to other project very weird things can happen.
If your machines are driving you mad and you want to start all over
again, delete your <code>.vagrant</code>, go to <code> ~/.vagrant.d/boxes </code> and wipe out your boxes, go to <code>~/VirtualBox\ VMs/
</code> and trash your images.

If you don't want to be so drastic, these commands are useful for
troubleshooting and keeping an eye on orphan machines:


- <code>vagrant status</code> to see the state of your machines and shut
  them down if you plan to remove them.

- <code>vagrant destroy</code> to remove the association in .vagrant and
  the virtual image.

- <code>vagrant box list</code> shows your available boxes (those stored in ~/.vagrant.d/boxes)

- <code>VBoxManage list vms</code> shows the Virtual Box machines (in VirtualBox\ VMs/)

- <code>vagrant destroy box <em>X</em></code> to remove the box <em>X</em>

- <code> VBoxManage unregistervm   \<uuid\>|\<name\> [--delete]</code> to delete a VM machine

For example:

    vagrant git:(master) VBoxManage list vms

    "vagrant_1340547733" {7cb51e25-9296-464c-8686-43c3c8b4e1a8}
    "vagrant_1343747935" {e22b8a76-b0c4-42a9-87cf-68bbce78c804}
    "vagrant_1344073912" {1987c417-1d94-4eac-81f8-d9cd89f3b9c8}
    "vagrant_1344074484" {5a80d54a-aff9-4ed4-a077-54d6e7213b0b}

let's say that the uuid {e22b8a76-b0c4-42a9-87cf-68bbce78c804} is the
one for production specified in your .vagrant:

    #.vagrant
    {"active":{"production":"e22b8a76-b0c4-42a9-87cf-68bbce78c804","development":"a447fdcf-b1ed-4a18-8801-fcb767df0a56"}} 

you could just type <code>vagrant destroy production</code> to both the
machine and the key in .vagrant, but if you wanted to do it manually you
could type:

    VBoxManage unregistervm e22b8a76-b0c4-42a9-87cf-68bbce78c804 --delete

<br />
###Vagrant user is being prompted for a sudo password
> [default] -- v-root: /vagrant
> The following SSH command responded with a non-zero exit status.
> Vagrant assumes that this means the command failed!

You need to edit your sudoers table (see http://vagrantup.com/v1/docs/base_boxes.html, "Setup Permissions"), for example

    # sudo visudo  #edits /etc/sudoers

    ALL ALL=(ALL) NOPASSWD: ALL
    %staff ALL=(ALL) NOPASSWD: ALL

<br />
###vagrant reload doesn't work
Sometimes is enough ssh'ing your vagrant and restart after a
<code>sudo /etc/init.d/networking restart </code>

<br />

###File owner and permissions going nuts  (????:????)
That happenend to us quite often before switching to NFS (that's the
best solution), alternatively, a restart does also the trick.

<br />
### Port Forwarding doesn't work for certain port numbers

    Vagrant::Config.run do |config|
      config.vm.define :dev do |dev_config|
        dev_config.vm.box = "orlyboxdev"
        
        # http://coderwall.com/p/zdnscw
        # this allows vagrant to forward ports between 1 and 1024
        if ["up", "resume"].include? ARGV[0]
          system %{ sudo sysctl -w net.inet.ip.forwarding=1 } 
          system %{ sudo ipfw add fwd 127.0.0.1,8080 tcp from any to any 80  "in" }
          system %{ sudo ipfw add fwd 127.0.0.1,8443 tcp from any to any 443 "in" }
        end
    
        dev_config.vm.forward_port 3000, 3000 # web in development
        dev_config.vm.forward_port 443,  8443 # web in development through NGINX with SSL
        dev_config.vm.forward_port 80,   8080 # web in development through NGINX
        
        # (...) 
      end
    end
