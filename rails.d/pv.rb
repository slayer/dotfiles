if defined?(Rails) && defined?(Survey)

  S = Survey
  def qf id
    Survey::Question::Base.find id
  end

  def sf id = nil
    case id
    when Integer
      sel = id > 100_000 ? :origin_id : :id
      Survey::MR.where(sel => id).first
    when Array
      sel = id[0] > 100_000 ? :origin_id : :id
      Survey::MR.where(sel => id)
    else
      Survey::MR.last
    end
  end

  def uf id; User.find id; end

  def admins
    User.where(:email => AdminEmails)
  end

end
