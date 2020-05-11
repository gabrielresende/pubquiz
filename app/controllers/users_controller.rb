class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update_me]

  # GET /me
  def me
    @user = current_user
    render :show
  end

  # PATCH /me
  def update_me
    @user = current_user
    if @user.update(user_params)
      render nothing: true, status: :ok
    else
      format.json { render json: @user.errors, status: :unprocessable_entity }
    end
  end

  private
  
    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:name, :access_hash)
    end
end
