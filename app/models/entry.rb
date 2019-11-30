class Entry < ApplicationRecord
    belongs_to :user, :inverse_of => :entries
end
