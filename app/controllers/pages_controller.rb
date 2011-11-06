class PagesController < ApplicationController
  
  def home
  
  end
  
  def sms
  	logger.info "---- #{params[:origin]} -> #{params[:destination]} -----"
  	
  	require 'open-uri'
  	@response = open("http://maps.googleapis.com/maps/api/directions/json?origin=#{params[:origin]}&destination=#{params[:destination]}&sensor=false").read
		@directions = JSON.parse(@response)
		
		messages = []
		@body = ''
		length = 0
		message_length = 0
		message_count = 0
		
		@directions['routes'][0]['legs'][0]['steps'].each_with_index do |step, i|
			line = step['html_instructions'].gsub(/<div.*>.*<\/div>/i, "").gsub(/<\/?[^>]*>/, "")
			length = line.length
			message_length = message_length + length
			
			if (message_length < 160)
				(messages[message_count].blank?) ? messages[message_count] = [line] : messages[message_count] << (line)
			else
				message_count = message_count + 1
				(messages[message_count].blank?) ? messages[message_count] = [line] : messages[message_count] << (line)
				message_length = 0
			end
		end
		
		sent = false
		
		messages.each do |message|
			body = message.join("\n\n")
			if (twilio_resp = Twilio::Sms.message('+17147708060',params['phone'],body))
				sent = true
			else
				sent = false
			end
			logger.info "----- #{twilio_resp} -----"
		end
		
		if sent
			redirect_to(root_path, :notice => 'SMS successfully sent.')
		else
			redirect_to(root_path, :notice => 'Problem sending SMS.')
		end
  end
end