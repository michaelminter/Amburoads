class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter(:twilio_client)
  
  def twilio_client
    #@client = Twilio::REST::Client.new('AC02ce67c726254b128d04d4496ff46bb3', 'af193f1c37ca12dd96baf03eebe8f0ec')
    @twilio = Twilio.connect('AC02ce67c726254b128d04d4496ff46bb3', 'af193f1c37ca12dd96baf03eebe8f0ec')
  end
end
