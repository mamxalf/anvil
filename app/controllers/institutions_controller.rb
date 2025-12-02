class InstitutionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_institution, only: [ :show, :edit, :update, :destroy ]

  def index
    authorize Institution
    @institutions = policy_scope(Institution).ordered

    # Apply filters
    @institutions = @institutions.by_type(params[:institution_type]) if params[:institution_type].present?
    @institutions = @institutions.by_province(params[:province]) if params[:province].present?
    @institutions = @institutions.by_city(params[:city]) if params[:city].present?
    @institutions = @institutions.where("name ILIKE ?", "%#{params[:search]}%") if params[:search].present?

    render inertia: "Institutions/Index", props: {
      institutions: @institutions.as_json(methods: [ :institution_type_name_id, :total_beneficiaries ]),
      institution_types: Institution.institution_types.keys.map { |t| { value: t, label: I18n.t("institutions.types.#{t}") } },
      filters: {
        institution_type: params[:institution_type],
        province: params[:province],
        city: params[:city],
        search: params[:search]
      }
    }
  end

  def show
    authorize @institution
    render inertia: "Institutions/Show", props: {
      institution: @institution.as_json(
        methods: [ :institution_type_name_id, :total_beneficiaries, :full_address ],
        include: {
          beneficiaries: { only: [ :id, :name, :gender ], methods: [ :age ] }
        }
      ),
      recent_distributions: @institution.recent_distributions.as_json(
        include: { menu: { only: [ :id, :name ] } }
      )
    }
  end

  def new
    authorize Institution
    @institution = Institution.new
    render inertia: "Institutions/Form", props: {
      institution: @institution.as_json,
      institution_types: Institution.institution_types.keys.map { |t| { value: t, label: I18n.t("institutions.types.#{t}") } },
      is_edit: false
    }
  end

  def create
    authorize Institution
    @institution = Institution.new(institution_params)

    if @institution.save
      flash[:success] = I18n.t("messages.created", resource: I18n.t("institutions.singular"))
      redirect_to institution_path(@institution)
    else
      session[:errors] = @institution.errors.messages
      redirect_to new_institution_path
    end
  end

  def edit
    authorize @institution
    render inertia: "Institutions/Form", props: {
      institution: @institution.as_json(methods: [ :institution_type_name_id ]),
      institution_types: Institution.institution_types.keys.map { |t| { value: t, label: I18n.t("institutions.types.#{t}") } },
      is_edit: true
    }
  end

  def update
    authorize @institution
    if @institution.update(institution_params)
      flash[:success] = I18n.t("messages.updated", resource: I18n.t("institutions.singular"))
      redirect_to institution_path(@institution)
    else
      session[:errors] = @institution.errors.messages
      redirect_to edit_institution_path(@institution)
    end
  end

  def destroy
    authorize @institution
    @institution.destroy
    flash[:success] = I18n.t("messages.deleted", resource: I18n.t("institutions.singular"))
    redirect_to institutions_path
  end

  private

  def set_institution
    @institution = Institution.includes(:beneficiaries, :meal_distributions).find(params[:id])
  end

  def institution_params
    params.require(:institution).permit(
      :name,
      :institution_type,
      :address,
      :province,
      :city,
      :district,
      :postal_code,
      :phone,
      :email,
      :student_count,
      :contact_person
    )
  end
end

