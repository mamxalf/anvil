class Avo::Resources::FoodItem < Avo::BaseResource
  self.title = :name
  self.includes = []
  self.search = {
    query: -> { query.ransack(name_cont: params[:q], code_cont: params[:q], m: "or").result(distinct: false) }
  }

  def fields
    field :id, as: :id
    field :name, as: :text
    field :code, as: :text
    field :category, as: :select, options: {
      makanan_pokok: "Makanan Pokok",
      lauk_hewani: "Lauk Hewani",
      lauk_nabati: "Lauk Nabati",
      sayuran: "Sayuran",
      buah: "Buah",
      susu: "Susu"
    }
    field :description, as: :textarea
    field :energy_per_100g, as: :number, name: "Energi (kkal)"
    field :protein_per_100g, as: :number, name: "Protein (g)"
    field :fat_per_100g, as: :number, name: "Lemak (g)"
    field :carbohydrate_per_100g, as: :number, name: "Karbohidrat (g)"
    field :fiber_per_100g, as: :number, name: "Serat (g)"
    field :portion_size, as: :number, name: "Ukuran Porsi"
    field :portion_unit, as: :text, name: "Satuan Porsi"
    field :urt_description, as: :text, name: "URT"

    field :menu_items, as: :has_many

    field :created_at, as: :date_time
    field :updated_at, as: :date_time
  end
end

