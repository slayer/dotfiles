def qf id
  Survey::Question::Base.find id
end

def sf id = nil
  case id
  when Integer
    Survey::MR.where(:id => id).first
  when String
    if id =~ /\d+-\d+/
      Survey::MR.where(:origin_id => id).first
    else
      Survey::MR.where(:title.like id).first
    end
  when Array
    Survey::MR.where(:id => id)
  else
    Survey::MR.last
  end
end

def uf id
  case id
  when Integer
    User.find id
  when String
    User.where(:email.like => "#{id}%").first
  end
end

def admins
  User.where(:email => AdminEmails)
end
