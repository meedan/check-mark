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
    request_api 'user', { name: 'Test', email: email, password: '12345678', password_confirmation: '12345678', provider: '' }
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
    team = request_api 'team', { name: "Test Team #{Time.now.to_i}", email: email, set_tasks_enabled: true }
    team_id = JSON.parse(team.body)['data']['dbid']
    request_api 'team_data_field', { team_id: team_id, fieldset: params[:data_field_name] } unless params[:data_field_name].nil?
    request_api 'project', { title: "Test Project #{Time.now.to_i}", team_id: team_id }
    @driver.close if @driver.respond_to?(:close)
    # Go back to the extension
    window = @driver.window_handles.first
    @driver.switch_to.window(window)
    @driver.navigate.refresh
    wait_for_selector('#save-button')
  end

  def get_config(config_variable)
    ENV[config_variable] || @config[config_variable]
  end

  def save_screenshot(title)
    path = "/tmp/ #{(0...8).map { rand(65..90).chr }.join}.png"
    @driver.save_screenshot(path)
    auth_header = { 'Authorization' => "Client-ID #{get_config('IMGUR_CLIENT_ID')}" }
    image = Base64.strict_encode64(File.open(path).read)
    body = { image: image, type: 'file' }
    count = 0
    begin
      count += 1
      response = HTTParty.post('https://api.imgur.com/3/image', body: body, headers: auth_header)
      sleep 10
    end while ((JSON.parse(response.body)['status'] != 200) && (count < 3))
    JSON.parse(response.body)['data']['link']
  rescue Exception => e
    "(couldn't take screenshot for '#{title}', error was: '#{e.message}')"
  end

  def close_browser
    @driver.quit
  rescue
  end

  def wait_for_selector(selector, type = :css, _timeout = 20, index: 0)
    wait_for_selector_list(selector, type)[index]
  end

  def wait_for_selector_list(selector, type = :css, timeout = 20, _test = 'unknown', reload = false)
    elements = []
    attempts = 0
    wait = Selenium::WebDriver::Wait.new(timeout: timeout)
    start = Time.now.to_i
    while elements.empty? && attempts < 2
      attempts += 1
      sleep 0.5
      begin
        retries ||= 0
        wait.until { @driver.find_elements(type, selector).length.positive? }
        elements = @driver.find_elements(type, selector)
        elements.each do |e|
          raise 'Element is not being displayed' unless e.displayed?
        end
      rescue Selenium::WebDriver::Error::StaleElementReferenceError
        puts 'retry Selenium::WebDriver::Error::StaleElementReferenceError'
        sleep 1
        retry if (retries += 1) < 10
      rescue
        # rescue from 'Selenium::WebDriver::Error::TimeOutError:' to give more information about the failure
      end
      @driver.navigate.refresh if reload && elements.empty?
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
        # rescue from Selenium::WebDriver::Error::NoSuchElementError: to give more information about the failure
      end
    end while element.size.positive? && attempts < retries
    finish = Time.now.to_i - start
    raise "Element with selector #{type.upcase} '#{selector}' did not disappear for test '#{test}' after #{finish} seconds!" if element.size.positive?

    element
  end
end
