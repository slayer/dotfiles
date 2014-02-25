begin
  require 'hirb'

  def h obj, options = {}
    Hirb::Helpers::AutoTable.render(obj, options)
  end
  def hirb obj, options = {}
    puts Hirb::Helpers::AutoTable.render(obj, options)
  end
rescue LoadError
  nil
end
