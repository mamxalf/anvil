class Avo::Actions::VerifyInstructor < Avo::BaseAction
  self.name = "Verify Instructor"
  # self.visible = -> do
  #   true
  # end

  def handle(**args)
    models, fields, current_user, resource = args.values_at(:models, :fields, :current_user, :resource)

    models.each do |model|
      # Execute the verification logic here
      # model.update(verified: true)
    end
    succeed "Instructor verified!"
  end
end
