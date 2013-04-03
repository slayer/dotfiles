def transaction &block
  ActiveRecord::Base.transaction do
    yield
  end
end
