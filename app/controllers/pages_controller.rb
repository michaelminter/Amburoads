class PagesController < ApplicationController
  
  def home
  
  end
  
  def set_geolocation
    session[:location] = {:latitude=> params[:latitude], :longitude=> params[:longitude]}
    logger.info "--- #{params[:latitude]}, #{params[:longitude]} ---"
  end
end