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

  # ...
end
def db; DatabaseHelpers; end
