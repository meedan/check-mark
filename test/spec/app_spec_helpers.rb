module AppSpecHelpers

  def request_api(path, params)
    require 'net/http'
    uri = URI("#{@config['check_api_url']}/test/#{path}")
    uri.query = URI.encode_www_form(params)
    Net::HTTP.get_response(uri)
  end

  def login(params = {})
    # Create user and confirm account
    email = "test-#{Time.now.to_i}@test.com"
    user = request_api 'user', { name: 'Test', email: email, password: '12345678', password_confirmation: '12345678', provider: '' }
    request_api 'confirm_user', { email: email }

    # Open extension
    open_extension(params[:media_type], params[:media_content])
    # Click on "sign in" 
    wait_for_selector('#login-button').click
    sleep 3
    window = @driver.window_handles.last
    @driver.switch_to.window(window)

    # Login, create a team, create a project and a datafield
    @driver.navigate.to "#{@config['check_api_url']}/test/session?email=#{email}"
    team = request_api 'team', { name: "Test Team #{Time.now.to_i}", email: email }
    team_id = JSON.parse(team.body)['data']['dbid']
    data_field  = request_api "team_data_field", {team_id: team_id, fieldset: params[:data_field_name]} if params[:data_field_name]!=nil
    project = request_api 'project', { title: "Test Project #{Time.now.to_i}", team_id: team_id }
    @driver.close if @driver.respond_to?(:close)
    # Go back to the extension 
    window = @driver.window_handles.first
    @driver.switch_to.window(window)
    @driver.navigate.refresh
    wait_for_selector('#save-button')
  end

  def save_screenshot(title)
    begin
      path = '/tmp/' + (0...8).map{ (65 + rand(26)).chr }.join + '.png'
      @driver.save_screenshot(path)
      auth_header =  {'Authorization' => 'Client-ID ' + @config['imgur_client_id']}
      image = Base64.strict_encode64(File.open(path).read)
      body = {image: image, type: 'file'}
      count = 0
      begin
        count = count + 1
        response = HTTParty.post('https://api.imgur.com/3/image', body: body, headers: auth_header)
        sleep 10
      end while (JSON.parse(response.body)['status'] != 200 and count < 3)
      JSON.parse(response.body)['data']['link']
    rescue Exception => e
      "(couldn't take screenshot for '#{title}', error was: '#{e.message}')"
    end
  end

  def close_browser
    begin
      @driver.quit
    rescue
    end
  end

  def wait_for_selector(selector, type = :css, timeout = 20, index: 0)
    wait_for_selector_list(selector, type)[index]
  end

  def wait_for_selector_list(selector, type = :css, timeout = 20, test = 'unknown')
    elements = []
    attempts = 0
    wait = Selenium::WebDriver::Wait.new(:timeout => timeout)
    start = Time.now.to_i
    while elements.empty? && attempts < 2 do
      attempts += 1
      sleep 0.5
      begin
        wait.until { @driver.find_elements(type, selector).length > 0 }
        elements = @driver.find_elements(type, selector)
        elements.each do |e|
          raise "element is not being displayed" unless  e.displayed?
        end
      rescue
        # rescue from 'Selenium::WebDriver::Error::TimeOutError:' to give more information about the failure
      end
    end
    finish = Time.now.to_i - start
    raise "Could not find element with selector #{type.upcase} '#{selector}' after #{finish} seconds!" if elements.empty?
    elements
  end

  def wait_for_selector_none(selector, type = :css, retries = 10, test = 'unknown')
    attempts = 0
    start = Time.now.to_i
    begin
      attempts += 1
      sleep 0.5
      begin
        element = wait_for_selector_list(selector, type)
      rescue
        element = []
        #rescue from Selenium::WebDriver::Error::NoSuchElementError: to give more information about the failure
      end
    end while element.size > 0 && attempts < retries
    finish = Time.now.to_i - start
    raise "Element with selector #{type.upcase} '#{selector}' did not disappear for test '#{test}' after #{finish} seconds!" if element.size > 0
    element
  end
end