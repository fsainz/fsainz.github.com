---
layout: post
title: Simple Capistrano Backup
subtitle: I wanted to have a dead simple script to create a backup of the files and the database on the deployer home folder with a capistrano task.
heading-class: "post-heading-only-image-compact"

---

{{ page.title }}
================

<p class="meta">June 17th, 2015 - Bonn</p>

I wanted to have a dead simple script to create a backup of the files and the database on the deployer home folder with a capistrano task.
It could use some refactor, and it could be made more flexible in many aspects, but it works and it's just a small bunch of lines.

There are good backup libraries that you let you encrypt, split, upload to multiple places and be notified whether has been a problem or not. They also take care of automating the restoring process, and let you switch between different versions and remove old backups. Setting that up takes more time though, this script is only valid for simple situations, it doesn't compare to those libraries but it sure beats not having any script at all.

I added explicitely the <code>PGPASSWORD</code> to the dump command, but there are better ways, you can add a <code>.pgpass</code> file to your home folder, and add a <code>--no-password</code> flag (more info <a href="http://www.postgresql.org/docs/current/static/libpq-pgpass.html">here</a>). You can also add it as an <a href="http://www.postgresql.org/docs/current/static/libpq-pgpass.html">environment variable</a>

Another improvement is to make it run periodically using a cron job: <a href="http://www.gotealeaf.com/blog/cron-jobs-and-rails">cron-jobs-and-rails</a>


{% highlight ruby %}
# lib/capistrano/tasks/simple_backup.rake

set :database_staging,    "database_staging"
set :database_production, "database_production"
# IMPORTANT -> put a path to the folder, not the symlink, like "../shared/public/uploads"
set :files_to_backup_relative_path, "../shared/public/uploads"

namespace :deploy do

  desc "Dump the DB and tar the uploads to the deployer home"
  task :simple_backup do
    stage = fetch(:stage)
    database = fetch("database_#{stage}".to_sym)
    raise "Missing database name" unless database

    scp_commands = []
    time_stamp = Time.now.strftime("%F-%H-%M-%S")
    database_dump_name = "dump_#{database}_#{time_stamp}"
    database_dump_cmd = "PGPASSWORD=********* pg_dump #{database} -U postgres -h localhost > #{database_dump_name}"
    perform_files_backup = !!fetch(:files_to_backup_relative_path)
    if perform_files_backup
      files_path = File.expand_path(File.join(release_path, fetch(:files_to_backup_relative_path)))
      files_parent_path = File.expand_path("../", files_path)
      files_path_basedir = File.basename(files_path)
      files_backup_name = "files_#{stage}_#{time_stamp}.tar.gz"
    end

    puts "\n ### STARTING BACKUP ON #{stage.upcase} AT #{time_stamp}"

    on roles(:app) do |server|
      puts "\n ### DUMPING THE DATABASE"
      scp_base_cmd = "scp #{server.user}@#{server.hostname}:~/"
      execute database_dump_cmd
      scp_commands << scp_base_cmd + database_dump_name + " ."

      if perform_files_backup
        files_compression_cmds = []
        files_compression_cmds << "cd #{files_parent_path}"
        files_compression_cmds << "tar zczf #{files_backup_name} #{files_path_basedir}"
        files_compression_cmds << "mv #{files_backup_name} ~"
        files_compression_cmd = files_compression_cmds.join(" && ")

        puts "\n ### COMPRESSING FILES AT #{files_path}"
        puts files_compression_cmd
        execute files_compression_cmd
        scp_commands << scp_base_cmd + files_backup_name + " ."
      end

      puts "\n GET THE FILES WITH:\n"
      scp_commands.each{|cmd| puts cmd}
      puts "\n\n"
    end
  end

end


{% endhighlight %}

After executing it, you get the lines needed to download the files

`bundle exec cap staging deploy:simple_backup`

    scp deployer@[IP]:~/files_production_2015-06-16-15-33-28.tar.gz .
    scp deployer@[IP]:~/dump_database_production_2015-06-16-15-33-28 .
