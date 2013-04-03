if defined?(Mongoid)
  def m criteria
    criteria.map{|item| item}
  end
end
