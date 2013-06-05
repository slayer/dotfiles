include Rails.application.routes.url_helpers
default_url_options[:host] = Rails.application.class.parent_name.downcase

include ActionView::Helpers           # All Rails helpers
# include ApplicationController._helpers # Your own helpers
#
# unfortunately that breaks some functionality (e.g. the named route helpers above)
#  so, look at actionpack/lib/action_view/helpers.rb and choose the helpers you need
#  (and which don't break anything), e.g.
include ActionView::Helpers::DebugHelper
include ActionView::Helpers::NumberHelper
include ActionView::Helpers::RawOutputHelper rescue nil
include ActionView::Helpers::SanitizeHelper
include ActionView::Helpers::TagHelper
include ActionView::Helpers::TextHelper
include ActionView::Helpers::TranslationHelper
