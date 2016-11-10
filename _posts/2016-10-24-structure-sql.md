---
layout: post
title: From schema.rb to structure sql
heading-class: "post-heading-only-image-compact"
---

{{ page.title }}
================

<p class="meta">October 24th, 2016 - Bonn</p>

We use materialized views and proceadures in our apps, which are not reflected
on the `schema.rb`

To be able to use them in our tests and load the db structure without needing
to run migrations, it should be enough to set `config.active_record.schema_format = :sql`
and call `rake db:structure:dump`, but this task has currently an invalid option for
postgres 9.5+

    #   rake db:structure:dump
    #   =>  pg_dump: invalid option -- i
    #       Try "pg_dump --help" for more information.
    #       rake aborted!
    #       Error dumping database

This has been fixed in the stable release with this commit: <a target="_blank" href="https://github.com/rails/rails/commit/cd900f10a7c8bc3c07e4aade98c8c5040512ea31">Remove deprecated pg_dump -i flag</a>
and backported to several rails versions. If you rather keep using the tagged version from a gem server instead of pointing to github stable
you can add this through an initializer like this one (depending on your activere_record version)

{% highlight ruby %}
# initializers/remove_deprecated_pg_dump_flag_patch.rb

raise 'Can not patch this version of ActiveRecord' unless ActiveRecord::VERSION::STRING == '4.1.4'

module ActiveRecord
  module Tasks
    class PostgreSQLDatabaseTasks
      def structure_dump(filename)
        set_psql_env
        search_path = configuration['schema_search_path']
        unless search_path.blank?
          search_path = search_path.split(",").map{|search_path_part| "--schema=#{Shellwords.escape(search_path_part.strip)}" }.join(" ")
        end

        command = "pg_dump -s -x -O -f #{Shellwords.escape(filename)} #{search_path} #{Shellwords.escape(configuration['database'])}"
        raise 'Error dumping database' unless Kernel.system(command)

        File.open(filename, "a") { |f| f << "SET search_path TO #{ActiveRecord::Base.connection.schema_search_path};\n\n" }
      end
    end
  end
end
{% endhighlight %}
