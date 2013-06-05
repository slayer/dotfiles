app_name = Rails.application.class.parent_name.downcase
app_env  = Rails.env[0...3]
IRB.conf[:PROMPT] ||= {}
IRB.conf[:PROMPT][:RAILS] = {
  :PROMPT_I => "#{ app_name }(#{ app_env })> ",
  :PROMPT_N => "#{ app_name }(#{ app_env })| ",
  :PROMPT_C => "#{ app_name }(#{ app_env })| ",
  :PROMPT_S => "#{ app_name }(#{ app_env })%l ",
  :RETURN => "=> %s\n",
  :AUTO_INDENT => true,
}
IRB.conf[:PROMPT_MODE] = :RAILS
