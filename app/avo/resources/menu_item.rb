class Avo::Resources::MenuItem < Avo::BaseResource
  self.title = :id
  self.includes = [ :menu, :food_item ]

  def fields
    field :id, as: :id
    field :menu, as: :belongs_to
    field :food_item, as: :belongs_to, name: "Bahan Pangan"
    field :portion_size, as: :number, name: "Ukuran Porsi"
    field :portion_unit, as: :text, name: "Satuan Porsi"
    field :meal_type, as: :select, options: {
      makanan_utama: "Makanan Utama",
      selingan: "Selingan"
    }, name: "Tipe Makanan"

    field :created_at, as: :date_time
    field :updated_at, as: :date_time
  end
end

