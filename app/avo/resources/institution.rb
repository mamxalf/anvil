class Avo::Resources::Institution < Avo::BaseResource
  self.title = :name
  self.includes = []
  self.search = {
    query: -> { query.ransack(name_cont: params[:q], city_cont: params[:q], m: "or").result(distinct: false) }
  }

  def fields
    field :id, as: :id
    field :name, as: :text
    field :institution_type, as: :select, options: {
      paud: "PAUD/TK/RA",
      sd: "SD/MI",
      smp: "SMP/MTS",
      sma: "SMA/MA",
      pesantren: "Pondok Pesantren",
      posyandu: "Posyandu"
    }, name: "Tipe Institusi"
    field :address, as: :textarea, name: "Alamat"
    field :province, as: :text, name: "Provinsi"
    field :city, as: :text, name: "Kota/Kabupaten"
    field :district, as: :text, name: "Kecamatan"
    field :postal_code, as: :text, name: "Kode Pos"
    field :phone, as: :text, name: "Telepon"
    field :email, as: :text
    field :contact_person, as: :text, name: "Penanggung Jawab"
    field :student_count, as: :number, name: "Jumlah Siswa"

    field :beneficiaries, as: :has_many
    field :meal_distributions, as: :has_many

    field :created_at, as: :date_time
    field :updated_at, as: :date_time
  end
end

