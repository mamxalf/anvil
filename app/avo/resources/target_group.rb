class Avo::Resources::TargetGroup < Avo::BaseResource
  self.title = :name
  self.includes = []
  self.search = {
    query: -> { query.ransack(name_cont: params[:q], code_cont: params[:q], m: "or").result(distinct: false) }
  }

  def fields
    field :id, as: :id
    field :name, as: :text
    field :code, as: :text
    field :description, as: :textarea
    field :min_energy, as: :number, name: "Energi (kkal)"
    field :min_protein, as: :number, name: "Protein (g)"
    field :min_fat, as: :number, name: "Lemak (g)"
    field :min_carbohydrate, as: :number, name: "Karbohidrat (g)"
    field :min_fiber, as: :number, name: "Serat (g)"
    field :min_vitamin_a, as: :number, name: "Vitamin A (mcg)"
    field :min_vitamin_c, as: :number, name: "Vitamin C (mg)"
    field :min_vitamin_d, as: :number, name: "Vitamin D (mcg)"
    field :min_calcium, as: :number, name: "Kalsium (mg)"
    field :min_iron, as: :number, name: "Zat Besi (mg)"
    field :min_zinc, as: :number, name: "Zinc (mg)"
    field :age_range_start, as: :number, name: "Usia Mulai"
    field :age_range_end, as: :number, name: "Usia Akhir"

    field :menus, as: :has_many
    field :beneficiaries, as: :has_many

    field :created_at, as: :date_time
    field :updated_at, as: :date_time
  end
end

