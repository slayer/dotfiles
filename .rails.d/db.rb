module DatabaseHelpers
  extend self

  def tables
    Hirb::Console.render_output ActiveRecord::Base.connection.tables.map{|e|[e]},{
      :class   => Hirb::Helpers::AutoTable,
      :headers => %w<tables>,
    }
    true
  end

  def table(which)
    Hirb::Console.render_output ActiveRecord::Base.connection.columns(which).map{ |e|
      [e.name, e.type, e.sql_type, e.limit, e.default, e.scale, e.precision, e.primary, e.null]
    },{
      :class   => Hirb::Helpers::AutoTable,
      :headers => %w<name type sql_type limit default scale precision primary null>,
    }
    true
  end

  def counts
    Hirb::Console.render_output ActiveRecord::Base.connection.tables.map{|e|
      [e, ActiveRecord::Base.connection.select_value("SELECT COUNT(*) FROM #{e}")]
    },{
      :class   => Hirb::Helpers::AutoTable,
      :headers => %w<table count>,
    }
    true
  end

  # TODO
  def indexes
    ActiveRecord::Base.connection.tables.map do |table|
      ActiveRecord::Base.connection.select_values("SHOW INDEXES FROM #{table}")
    end
  end

  def table_size
    adapter = Rails.application.class.config.database_configuration[Rails.env]["adapter"]
    dbname = Rails.application.class.config.database_configuration[Rails.env]["database"]
    if adapter =~ /mysql/
      query = %(SELECT table_name AS "Tables",
      round(((data_length + index_length) / 1024 / 1024), 2) "size"
      FROM information_schema.TABLES
      WHERE table_schema = "#{dbname}"
      ORDER BY size;)
    elsif adapter =~ /postgresql/
      query = %(
        SELECT
          table_name,
          pg_size_pretty(table_size) AS table_size,
          pg_size_pretty(indexes_size) AS indexes_size,
          pg_size_pretty(total_size) AS total_size
        FROM (
          SELECT
            table_name,
            pg_table_size(table_name) AS table_size,
            pg_indexes_size(table_name) AS indexes_size,
            pg_total_relation_size(table_name) AS total_size
          FROM (
            SELECT table_name AS table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
          ) AS all_tables
          ORDER BY total_size
        ) AS pretty_sizes
     )
    end

    result = ActiveRecord::Base.connection.select_all(query)
    hirb result#.sort{|a, b| b["size"] <=> a["size"] }
  end

end
def db; DatabaseHelpers; end
