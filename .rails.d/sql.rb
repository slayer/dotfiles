def sql(query)
    ActiveRecord::Base.connection.select_all(query)
end
