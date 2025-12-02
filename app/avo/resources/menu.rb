class Avo::Resources::Menu < Avo::BaseResource
  self.title = :name
  self.includes = [ :target_group, :created_by ]
  self.search = {
    query: -> { query.ransack(name_cont: params[:q], m: "or").result(distinct: false) }
  }

  def fields
    field :id, as: :id
    field :name, as: :text
    field :description, as: :textarea
    field :target_group, as: :belongs_to
    field :created_by, as: :belongs_to, name: "Dibuat Oleh"
    field :status, as: :select, options: {
      draft: "Draf",
      published: "Dipublikasi",
      archived: "Diarsipkan"
    }
    field :day_number, as: :number, name: "Hari ke"
    field :total_energy, as: :number, name: "Total Energi (kkal)"
    field :total_protein, as: :number, name: "Total Protein (g)"
    field :total_fat, as: :number, name: "Total Lemak (g)"
    field :total_carbohydrate, as: :number, name: "Total Karbohidrat (g)"
    field :total_fiber, as: :number, name: "Total Serat (g)"

    field :menu_items, as: :has_many
    field :meal_distributions, as: :has_many

    field :created_at, as: :date_time
    field :updated_at, as: :date_time
  end
end

