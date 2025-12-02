class Avo::Resources::Beneficiary < Avo::BaseResource
  self.title = :name
  self.includes = [ :institution, :target_group ]
  self.search = {
    query: -> { query.ransack(name_cont: params[:q], m: "or").result(distinct: false) }
  }

  def fields
    field :id, as: :id
    field :name, as: :text
    field :institution, as: :belongs_to, name: "Institusi"
    field :target_group, as: :belongs_to, name: "Kelompok Sasaran"
    field :date_of_birth, as: :date, name: "Tanggal Lahir"
    field :gender, as: :select, options: {
      male: "Laki-laki",
      female: "Perempuan"
    }, name: "Jenis Kelamin"
    field :allergies, as: :textarea, name: "Alergi"
    field :special_needs, as: :textarea, name: "Kebutuhan Khusus"

    field :created_at, as: :date_time
    field :updated_at, as: :date_time
  end
end

