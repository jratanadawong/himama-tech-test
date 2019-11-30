class Api::V1::AuthenticationController < Api::V1::ApiController
    skip_before_action :authenticate_request
   
    def authenticate
      command = AuthenticateUser.call(params[:email], params[:password])
   
      if command.success?
        user = User.find_by_email(params[:email])
        entries = Entry.includes(:user).where("user_id = ?", user.id)
        render json: { auth_token: command.result, user: user, entries: entries }
      else
        render json: { error: command.errors }, status: :unauthorized
      end
    end

  end