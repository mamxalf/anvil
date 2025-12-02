class Avo::Resources::MealDistribution < Avo::BaseResource
  self.title = :id
  self.includes = [ :institution, :menu, :distributed_by ]
  self.search = {
    query: -> { query.joins(:institution).ransack(institution_name_cont: params[:q], m: "or").result(distinct: false) }
  }

  def fields
    field :id, as: :id
    field :institution, as: :belongs_to, name: "Institusi"
    field :menu, as: :belongs_to
    field :distributed_by, as: :belongs_to, name: "Didistribusikan Oleh"
    field :distribution_date, as: :date, name: "Tanggal Distribusi"
    field :recipient_count, as: :number, name: "Jumlah Penerima"
    field :notes, as: :textarea, name: "Catatan"

    field :created_at, as: :date_time
    field :updated_at, as: :date_time
  end
end

