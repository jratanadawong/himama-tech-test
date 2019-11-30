class Api::V1::EntriesController < Api::V1::ApiController

    wrap_parameters :entry, include: [:clock_in, :clock_out, :date]

    def create
        entry = Entry.new(entry_params)
        entry[:user_id] = @current_user.id
        puts "entry: "
        puts entry
        if entry.save
            render json: {status: 'Entry created successfully', entry: entry}, status: :created
        else
            render json: { errors: entry.errors.full_messages }, status: :bad_request
        end
    end

    def update
        entry = Entry.find_by_id(params[:id])
        # entry[:clock_in] = entry_params[:clock_in]
        # entry[:clock_out] = entry_params[:clock_out]
        # entry[:date] = entry_params[:date]
        puts entry_params[:clock_in]
        if entry.update(clock_in: entry_params[:clock_in], clock_out: entry_params[:clock_out], date: entry_params[:date] )
            render json: {status: 'Entry updated successfully', entry: entry}, status: :ok
        else
            render json: { errors: entry.errors.full_messages }, status: :bad_request
        end
    end

    def all
        entries = Entry.includes(:user).where("user_id = ?", @current_user.id)
        if !entries.nil?
            render json: {entries: entries}, status: :ok
        else
            render json: { errors: entry.errors.full_messages }, status: :bad_request
        end
    end
  
    private
  
    def entry_params
        params.require(:entry).permit(:clock_in, :clock_out, :date)
    end
end