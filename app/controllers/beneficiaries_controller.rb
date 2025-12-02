class BeneficiariesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_beneficiary, only: [ :show, :edit, :update, :destroy ]

  def index
    authorize Beneficiary
    @beneficiaries = policy_scope(Beneficiary)
                      .includes(:institution, :target_group)
                      .ordered

    # Apply filters
    @beneficiaries = @beneficiaries.by_target_group(params[:target_group_id]) if params[:target_group_id].present?
    @beneficiaries = @beneficiaries.where(institution_id: params[:institution_id]) if params[:institution_id].present?
    @beneficiaries = @beneficiaries.by_gender(params[:gender]) if params[:gender].present?
    @beneficiaries = @beneficiaries.where("name ILIKE ?", "%#{params[:search]}%") if params[:search].present?

    render inertia: "Beneficiaries/Index", props: {
      beneficiaries: @beneficiaries.as_json(
        methods: [ :age, :gender_name_id, :has_dietary_restrictions? ],
        include: {
          institution: { only: [ :id, :name ] },
          target_group: { only: [ :id, :name ] }
        }
      ),
      target_groups: TargetGroup.ordered.as_json(only: [ :id, :name, :code ]),
      institutions: Institution.ordered.as_json(only: [ :id, :name ]),
      filters: {
        target_group_id: params[:target_group_id],
        institution_id: params[:institution_id],
        gender: params[:gender],
        search: params[:search]
      }
    }
  end

  def show
    authorize @beneficiary
    render inertia: "Beneficiaries/Show", props: {
      beneficiary: @beneficiary.as_json(
        methods: [ :age, :gender_name_id, :dietary_restrictions ],
        include: {
          institution: { only: [ :id, :name ], methods: [ :institution_type_name_id ] },
          target_group: { only: [ :id, :name, :code ] }
        }
      )
    }
  end

  def new
    authorize Beneficiary
    @beneficiary = Beneficiary.new
    @beneficiary.institution_id = params[:institution_id] if params[:institution_id].present?

    render inertia: "Beneficiaries/Form", props: {
      beneficiary: @beneficiary.as_json,
      target_groups: TargetGroup.ordered.as_json(only: [ :id, :name, :code ]),
      institutions: Institution.ordered.as_json(only: [ :id, :name ]),
      is_edit: false
    }
  end

  def create
    authorize Beneficiary
    @beneficiary = Beneficiary.new(beneficiary_params)

    if @beneficiary.save
      flash[:success] = I18n.t("messages.created", resource: I18n.t("beneficiaries.singular"))
      redirect_to beneficiary_path(@beneficiary)
    else
      session[:errors] = @beneficiary.errors.messages
      redirect_to new_beneficiary_path
    end
  end

  def edit
    authorize @beneficiary
    render inertia: "Beneficiaries/Form", props: {
      beneficiary: @beneficiary.as_json(
        methods: [ :age, :gender_name_id ],
        include: {
          institution: { only: [ :id, :name ] },
          target_group: { only: [ :id, :name ] }
        }
      ),
      target_groups: TargetGroup.ordered.as_json(only: [ :id, :name, :code ]),
      institutions: Institution.ordered.as_json(only: [ :id, :name ]),
      is_edit: true
    }
  end

  def update
    authorize @beneficiary
    if @beneficiary.update(beneficiary_params)
      flash[:success] = I18n.t("messages.updated", resource: I18n.t("beneficiaries.singular"))
      redirect_to beneficiary_path(@beneficiary)
    else
      session[:errors] = @beneficiary.errors.messages
      redirect_to edit_beneficiary_path(@beneficiary)
    end
  end

  def destroy
    authorize @beneficiary
    @beneficiary.destroy
    flash[:success] = I18n.t("messages.deleted", resource: I18n.t("beneficiaries.singular"))
    redirect_to beneficiaries_path
  end

  private

  def set_beneficiary
    @beneficiary = Beneficiary.includes(:institution, :target_group).find(params[:id])
  end

  def beneficiary_params
    params.require(:beneficiary).permit(
      :name,
      :institution_id,
      :target_group_id,
      :date_of_birth,
      :gender,
      :special_needs,
      :allergies
    )
  end
end

