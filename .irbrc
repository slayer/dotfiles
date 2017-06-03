#!/usr/bin/env ruby

require 'rubygems'
#require 'map_by_method' rescue nil
require 'pp'

# Enable tab-completion.
require 'irb/completion' rescue nil

# Enable prompt-less prompts
#IRB.conf[:PROMPT][:XMP][:RETURN] = "\# => %s\n"
#IRB.conf[:PROMPT][:XMP][:PROMPT_I] = ""
#IRB.conf[:PROMPT_MODE] = :XMP

# Auto-indentation.
IRB.conf[:AUTO_INDENT] = true

# Readline-enable prompts.
require 'irb/ext/save-history'
IRB.conf[:USE_READLINE] = true
IRB.conf[:SAVE_HISTORY] = 1000
IRB.conf[:HISTORY_PATH] = File::expand_path("~/.irb.hist")

# Colorize results
begin
  require 'rubygems'
  require 'wirble'
  Wirble.init
  Wirble.colorize
rescue LoadError
end

# Dynamic method finding; e.g., "hello".what? == 5 #=> ["length", "size"]
#begin
#  require File::expand_path("~/.irb_lib/method_finder")
#  require 'rubygems'
#  require 'what_methods'
#rescue LoadError
#  puts "Error loading method_finder. Run 'sudo gem install what_methods' to enable Object#what? method finding."
#end

# local_methods shows methods that are only available for a given object.
class Object
  def local_methods
    self.methods.sort - self.class.superclass.methods
  end
end


def ri(obj)
	puts `ri #{obj}`
end


# Simple regular expression helper
# show_regexp - stolen from the pickaxe
def show_regexp(a, re)
   if a =~ re
      "#{$`}<<#{$&}>>#{$'}"
   else
      "no match"
   end
end

# Convenience method on Regexp so you can do
# /an/.show_match("banana")
class Regexp
   def show_match(a)
       show_regexp(a, self)
   end
end

# Textmate helper
def mate *args
  flattened_args = args.map {|arg| "\"#{arg.to_s}\""}.join ' '
  `mate #{flattened_args}`
  nil
end

# Vi helper
def vi *args
  flattened_args = args.map { |arg| "\"#{arg.to_s}\""}.join ' '
  `vi #{flattened_args}`
  nil
end


require "ap" rescue nil

begin
  require 'looksee'

  Looksee.styles.merge!(
    :module => "\e[1;34m%s\e[0m" # purple
  )
rescue LoadError
end

# Rails on-screen logging

def change_log(stream)
  ActiveRecord::Base.logger = Logger.new(stream)
  ActiveRecord::Base.clear_active_connections!
end

def show_log
  change_log(STDOUT)
  puts "SQL log enabled. Enter 'reload!' to reload all loaded ActiveRecord classes"
end

def hide_log
  change_log(nil)

  puts "SQL log disabled. Enter 'reload!' to reload all loaded ActiveRecord classes"
end

# Simple benchmarking

def time(times = 1)
  require 'benchmark'

  ret = nil
  Benchmark.bm { |x| x.report { times.times { ret = yield } } }
  ret
end

if ENV['RAILS_ENV'] || defined?(Rails)
  require 'rubygems'
  require 'yaml'
  begin
    require 'hirb'
    Hirb.enable
  rescue LoadError
    puts "Error loading Hirb. Run 'sudo gem install hirb'"
  rescue
    puts "Error initializing Hirb"
  end
  # Thread.new { sleep 3; show_log; reload!; } if Rails && Rails.env.development?
end

# IRB configuration reloading

def IRB.reload
  load __FILE__
end

# SQL query execution

def sql(query)
  ActiveRecord::Base.connection.select_all(query)
end

def y obj
  puts obj.to_yaml
end

def j obj
	require 'multi_json' rescue nil
	require 'json' rescue nil
	if defined?(MultiJson)
		puts MultiJson.dump obj, :pretty => true
	else
		puts JSON.pretty_generate(obj)
	end
end

def cj obj
  require 'pygments'
  puts Pygments.highlight(JSON.pretty_generate(obj), :lexer => 'json', :formatter => 'terminal',  :options => {:encoding => 'utf-8'})
end


Dir["#{File.expand_path('~')}/.rails.d/*.rb"].each do |file|
  load file
end

if defined? Hirb
  def hirb obj, opts = {}
    puts Hirb::Helpers::AutoTable.render(obj, opts)
  end
end
